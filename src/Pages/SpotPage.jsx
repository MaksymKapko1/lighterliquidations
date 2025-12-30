import { AppHeader } from "../Components/AppHeader";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { CoinCard } from "../Components/CoinCard";
import { Col, Row, Card, Skeleton } from "antd";
import { SpotCard } from "../Components/SpotCard";
import { useLiquidations } from "../hooks/useLiquidations";
export const SpotPage = () => {
  const navigate = useNavigate();
  const { spotMarket, isReady } = useLiquidations();

  const isLoading = !isReady || !spotMarket;
  console.log("Spot Data from Hook:", spotMarket);
  return (
    <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <AppHeader />
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col xs={23} md={23} xl={23}>
          <Row gutter={[16, 16]}>
            {spotMarket.map((market, index) => (
              <Col
                xs={24}
                md={8}
                key={market.marketId || market.symbol || index}
              >
                <SpotCard
                  symbol={market.symbol}
                  price={market.price}
                  dailyHigh={market.dailyHigh}
                  dailyLow={market.dailyLow}
                  dailyUsdVolume={market.dailyUsdVolume}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
