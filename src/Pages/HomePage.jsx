import React, { useState, useEffect, useMemo, useReducer } from "react";
import { Col, Row } from "antd";
import { CoinCard } from "../Components/CoinCard";
import { useLiquidations } from "../hooks/useLiquidations";
import { AppHeader } from "../Components/AppHeader";
import { StatsOverview } from "../Components/StatsOverview";
import { RektStats } from "../Components/RektStats";
import { GlassNav } from "../Components/GlassNav";
// import { MARKET_CONFIG } from "../constants/markets";
import { MARKET_METADATA } from "../constants/marketMetadata";

export const HomePage = () => {
  const [period, setPeriod] = useState(24);
  const [activeSector, setActiveSector] = useState("All");

  const [dynamicMarkets, setDynamicMarkets] = useState([]);

  const {
    maxLiqs,
    liquidations,
    totalUsers,
    totalNetworkOi,
    totalVolume,
    newUsers,
    revenue,
    periodRekt,
    requestGlobalPeriod,
    topGainers,
    topLosers,
  } = useLiquidations(period);

  useEffect(() => {
    requestGlobalPeriod(period);
  }, [period]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("https://explorer.elliot.ai/api/markets");
        const apiData = await response.json();

        const formatted = apiData.map((item) => {
          const meta = MARKET_METADATA[item.symbol] || {};

          return {
            id: item.market_index,
            symbol: item.symbol,
            sector: meta.sector || "Crypto",
            title: meta.title || item.symbol,
            icon: meta.icon || "https://...",
          };
        });
        setDynamicMarkets(formatted);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMarkets();
  }, []);

  // 2. ФИЛЬТРАЦИЯ
  const visibleCards = useMemo(() => {
    if (dynamicMarkets.length === 0) return [];
    let filtered =
      activeSector === "All"
        ? [...dynamicMarkets]
        : dynamicMarkets.filter((card) => card.sector === activeSector);
    return filtered.sort((a, b) => {
      const valueA = maxLiqs[a.symbol] || 0;
      const valueB = maxLiqs[b.symbol] || 0;
      return valueB - valueA;
    });
  }, [activeSector, dynamicMarkets, maxLiqs]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <AppHeader />
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col xs={23} md={23} xl={23}>
          <StatsOverview
            totalUsers={totalUsers}
            totalNetworkOi={totalNetworkOi}
            totalVolume={totalVolume}
            newUsers={newUsers}
            revenue={revenue}
          />
          <RektStats
            stats={periodRekt}
            // value={periodRekt}
            period={period}
            onPeriodChange={setPeriod}
            topGainers={topGainers}
            topLosers={topLosers}
          />

          {/* НАВИГАЦИЯ */}
          <GlassNav
            active={activeSector}
            onChange={setActiveSector}
            markets={dynamicMarkets}
          />

          {/* 3. ОТРИСОВКА (ТОЛЬКО ЦИКЛ, НИКАКОГО ХАРДКОДА) */}
          <Row gutter={[16, 16]}>
            {visibleCards.map((card) => (
              <Col xs={24} md={8} key={card.id}>
                <CoinCard
                  title={card.title}
                  symbol={card.symbol}
                  iconUrl={card.icon}
                  data={liquidations[card.symbol]}
                  max24h={maxLiqs[card.symbol] || 0}
                  linkTo={`/liquidations/${card.id}`}
                />
              </Col>
            ))}

            {visibleCards.length === 0 && (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "40px",
                  color: "#666",
                }}
              >
                No assets found in {activeSector}.
              </div>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
