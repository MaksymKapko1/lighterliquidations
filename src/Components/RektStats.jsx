import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  FireOutlined,
  FallOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export const RektStats = ({
  period,
  onPeriodChange,
  value,
  onRequestUpdate,
  topGainers = [],
  topLosers = [],
}) => {
  const options = [
    { label: "1H", value: 1 },
    { label: "4H", value: 4 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
    { label: "7D", value: 168 },
  ];

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
                {Number(val).toLocaleString("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          />

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "4px",
                borderRadius: "12px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "4px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(5px)",
              }}
            >
              {options.map((opt) => {
                const isActive = period === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => onPeriodChange(opt.value)}
                    style={{
                      cursor: "pointer",
                      padding: "6px 16px",
                      borderRadius: "8px",

                      color: isActive ? "#fff" : "#6b7280",
                      fontWeight: isActive ? "600" : "500",

                      background: isActive
                        ? "rgba(56, 139, 253, 0.15)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(56, 139, 253, 0.3)"
                        : "1px solid transparent",
                      transition: "all 0.3s ease",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: isActive
                        ? "0 0 10px rgba(56, 139, 253, 0.1)"
                        : "none",
                    }}
                  >
                    {isActive && (
                      <ClockCircleOutlined
                        style={{ fontSize: "12px", color: "#58a6ff" }}
                      />
                    )}
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card style={commonCardStyle} bodyStyle={{ padding: "24px" }}>
          <Row gutter={[24, 24]}>
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
