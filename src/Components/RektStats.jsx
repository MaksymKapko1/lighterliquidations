import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Radio } from "antd";
import {
  FireOutlined,
  FallOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

export const RektStats = ({
  value,
  onRequestUpdate,
  topGainers = [],
  topLosers = [],
}) => {
  const [period, setPeriod] = useState(24);

  // Вызываем обновление при загрузке и при смене периода
  useEffect(() => {
    onRequestUpdate(period);
  }, [period]);
  // Убрали onRequestUpdate из зависимостей, чтобы избежать двойных рендеров

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const commonCardStyle = {
    background: "linear-gradient(90deg, #141414 0%, #1f1f1f 100%)",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
    height: "100%",
  };

  const centeredBodyStyle = {
    padding: "24px",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Row
      justify="center"
      style={{ marginBottom: "20px" }}
      align="stretch"
      gutter={[24, 24]}
    >
      {/* ЛЕВАЯ КАРТОЧКА: ЛИКВИДАЦИИ */}
      <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column" }}>
        <Card style={commonCardStyle} bodyStyle={centeredBodyStyle}>
          <div
            style={{
              textAlign: "center",
              color: "#8c8c8c",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Total Liquidated
          </div>
          <Statistic
            value={value}
            prefix={
              <span
                style={{
                  color: "#ff4d4f",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                $
              </span>
            }
            suffix={
              <FireOutlined
                style={{
                  color: "#ff7875",
                  fontSize: "2rem",
                  marginLeft: "15px",
                  verticalAlign: "middle",
                }}
              />
            }
            formatter={(val) => (
              <span
                style={{
                  color: "#ff4d4f",
                  fontSize: "3rem",
                  fontWeight: "bold",
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {Number(val).toLocaleString()}
              </span>
            )}
          />
          <div style={{ marginTop: "20px" }}>
            <Radio.Group
              value={period}
              onChange={handlePeriodChange}
              buttonStyle="solid"
            >
              <Radio.Button value={4}>4H</Radio.Button>
              <Radio.Button value={12}>12H</Radio.Button>
              <Radio.Button value={24}>24H</Radio.Button>
              <Radio.Button value={168}>7D</Radio.Button>
              <Radio.Button value={0}>ALL</Radio.Button>
            </Radio.Group>
          </div>
        </Card>
      </Col>

      {/* ПРАВАЯ КАРТОЧКА: ТОПЫ */}
      <Col xs={24} md={12}>
        <Card style={commonCardStyle} bodyStyle={{ padding: "24px" }}>
          <Row gutter={[24, 24]}>
            {/* LOSERS */}
            <Col span={12}>
              <div
                style={{
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "8px",
                }}
              >
                <FallOutlined style={{ color: "#ff4d4f" }} /> Top Losers
              </div>
              <div style={{ minHeight: "120px" }}>
                {topLosers && topLosers.length > 0 ? (
                  topLosers.map((item, idx) => (
                    <div
                      key={item.symbol || idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#e6edf3", fontWeight: "600" }}>
                        {item.symbol}
                      </span>
                      <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                        <ArrowDownOutlined
                          style={{ fontSize: "10px", marginRight: "4px" }}
                        />
                        {Math.abs(item.daily_price_change ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: "#555",
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    Loading...
                  </div>
                )}
              </div>
            </Col>

            {/* GAINERS */}
            <Col span={12}>
              <div
                style={{
                  color: "#8c8c8c",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: "8px",
                }}
              >
                <TrophyOutlined style={{ color: "#3fb950" }} /> Top Gainers
              </div>
              <div style={{ minHeight: "120px" }}>
                {topGainers && topGainers.length > 0 ? (
                  topGainers.map((item, idx) => (
                    <div
                      key={item.symbol || idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#e6edf3", fontWeight: "600" }}>
                        {item.symbol}
                      </span>
                      <span style={{ color: "#3fb950", fontWeight: "bold" }}>
                        <ArrowUpOutlined
                          style={{ fontSize: "10px", marginRight: "4px" }}
                        />
                        {Math.abs(item.daily_price_change ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: "#555",
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    Loading...
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
