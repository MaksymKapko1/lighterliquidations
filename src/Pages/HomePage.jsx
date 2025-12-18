import React, { useState, useEffect, useMemo } from "react";
import { Col, Row } from "antd";
import { CoinCard } from "../Components/CoinCard";
import { useLiquidations } from "../hooks/useLiquidations";
import { AppHeader } from "../Components/AppHeader";
import { StatsOverview } from "../Components/StatsOverview";
import { RektStats } from "../Components/RektStats";
import { GlassNav } from "../Components/GlassNav";
import { MARKET_CONFIG } from "../constants/markets";

export const HomePage = () => {
  const [period, setPeriod] = useState(24);
  const [activeSector, setActiveSector] = useState("All");

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

  // 2. ФИЛЬТРАЦИЯ
  const visibleCards = useMemo(() => {
    if (activeSector === "All") {
      return MARKET_CONFIG;
    }
    return MARKET_CONFIG.filter((card) => card.sector === activeSector);
  }, [activeSector]);

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
            value={periodRekt}
            period={period}
            onPeriodChange={setPeriod}
            topGainers={topGainers}
            topLosers={topLosers}
          />

          {/* НАВИГАЦИЯ */}
          <GlassNav active={activeSector} onChange={setActiveSector} />

          {/* 3. ОТРИСОВКА (ТОЛЬКО ЦИКЛ, НИКАКОГО ХАРДКОДА) */}
          <Row gutter={[16, 16]}>
            {visibleCards.map((card) => (
              <Col xs={24} md={8} key={card.id}>
                <CoinCard
                  title={card.title}
                  symbol={card.id}
                  iconUrl={card.icon}
                  data={liquidations[card.id]}
                  max24h={maxLiqs[card.id] || 0}
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
