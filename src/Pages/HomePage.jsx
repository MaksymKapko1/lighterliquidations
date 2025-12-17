import React from "react";
import { Col, Row } from "antd";
import { CoinCard } from "../Components/CoinCard";
import { useLiquidations } from "../hooks/useLiquidations";
import { AppHeader } from "../Components/AppHeader";
import { StatsOverview } from "../Components/StatsOverview";
import { RektStats } from "../Components/RektStats";
import { useState, useEffect } from "react";

export const HomePage = () => {
  const [period, setPeriod] = useState(24);
  useEffect(() => {
    requestGlobalPeriod(period);
  }, [period]);
  const {
    maxLiqs,
    liquidations,
    connectionStatus,
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
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <CoinCard
                title="Bitcoin"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                data={liquidations.BTC}
                max24h={maxLiqs.BTC || 0}
                linkTo="/liquidations/BTC"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="Ethereum"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                data={liquidations.ETH}
                linkTo="/liquidations/ETH"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="HYPE"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png"
                data={liquidations.HYPE}
                linkTo="/liquidations/HYPE"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="Sui"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png"
                data={liquidations.SUI}
                linkTo="/liquidations/SUI"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="Solana"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" //sol
                data={liquidations.SOL}
                linkTo="/liquidations/SOL"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="BNB"
                iconUrl="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" //bnb
                data={liquidations.BNB}
                linkTo="/liquidations/BNB"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="AAPL"
                iconUrl="https://s2.coinmarketcap.com/static/img/rwa/64x64/68789a83cbbf471de3366fd7.png"
                data={liquidations.AAPL}
                linkTo="/liquidations/AAPL"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="GOOGL"
                iconUrl="https://app.lighter.xyz/assets/googl-BTnagMQH.png"
                data={liquidations.GOOGL}
                linkTo="/liquidations/GOOGL"
              />
            </Col>

            <Col xs={24} md={8}>
              <CoinCard
                title="META"
                iconUrl="https://s2.coinmarketcap.com/static/img/rwa/64x64/68789be7cbbf471de336705d.png"
                data={liquidations.META}
                linkTo="/liquidations/META"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
