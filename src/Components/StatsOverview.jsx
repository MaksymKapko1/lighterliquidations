import React from "react";
import { Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  RiseOutlined,
  FireOutlined,
  BankOutlined,
} from "@ant-design/icons";

export const StatsOverview = ({
  totalUsers,
  liquidations,
  totalNetworkOi,
  totalVolume,
  newUsers,
  revenue,
  topGainers,
  topLosers,
}) => {
  const itemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100%",
    width: "100%",
  };

  const dividerStyle = {
    position: "absolute",
    right: 0,
    top: "10%",
    height: "80%",
    width: "1px",
    background: "rgba(255,255,255,0.1)",
  };

  return (
    <div
      style={{
        background: "rgba(13, 17, 23, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(48, 54, 61, 0.5)",
        borderRadius: "16px",
        padding: "24px 0",
        marginBottom: "30px",
        marginTop: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <Row
        align="middle"
        justify="space-around"
        style={{ width: "100%", margin: 0 }}
      >
        <Col xs={24} md={6} style={{ position: "relative" }}>
          <div style={itemStyle}>
            <div
              style={{
                color: "#8b949e",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.5px",
                marginBottom: "8px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <UserOutlined /> Registered Accounts
            </div>

            <div
              style={{ display: "flex", alignItems: "baseline", gap: "10px" }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#58a6ff",
                  textShadow: "0 0 15px rgba(88, 166, 255, 0.4)",
                  fontFamily: "monospace",
                  lineHeight: "1",
                }}
              >
                {totalUsers?.toLocaleString() || "0"}
              </div>

              {(newUsers > 0 || true) && (
                <div
                  style={{
                    background: "rgba(56, 139, 253, 0.15)",
                    color: "#58a6ff",
                    border: "1px solid rgba(56, 139, 253, 0.3)",
                    borderRadius: "20px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: "600",
                    height: "fit-content",
                  }}
                >
                  +{newUsers} 24h
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "8px",
                color: "rgba(88, 166, 255, 0.6)",
                fontSize: "11px",
              }}
            ></div>
          </div>

          <div className="hidden md:block" style={dividerStyle}></div>
        </Col>

        <Col xs={24} md={6} style={{ position: "relative" }}>
          <div style={itemStyle}>
            <div
              style={{
                color: "#8b949e",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginBottom: "5px",
              }}
            >
              <RiseOutlined style={{ color: "#4caf50" }} /> TOTAL OPEN INTEREST
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#fff" }}>
              $
              {totalNetworkOi?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div
              style={{
                color: "#4caf50",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4caf50",
                }}
              ></span>
              Market Healthy
            </div>
          </div>
          <div className="hidden md:block" style={dividerStyle}></div>
        </Col>

        <Col xs={24} md={6} style={{ position: "relative" }}>
          <div style={itemStyle}>
            <div
              style={{
                color: "#8b949e",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginBottom: "5px",
              }}
            >
              <FireOutlined style={{ color: "#ff4d4f" }} /> 24H ACTIVITY
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#fff" }}>
              $
              {totalVolume?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div style={{ color: "#ff4d4f", fontSize: "12px" }}>
              Total volume for 24h
            </div>
          </div>

          <div className="hidden md:block" style={dividerStyle}></div>
        </Col>

        <Col xs={24} md={6}>
          <div style={itemStyle}>
            <div
              style={{
                color: "#8b949e",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <BankOutlined style={{ color: "#faad14" }} /> 24H TOTAL TRADES
            </div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#fff",
                textShadow: "0 0 10px rgba(250, 173, 20, 0.2)",
              }}
            >
              {revenue?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div style={{ color: "#faad14", fontSize: "11px" }}>
              Live Data from Lighter.xyz
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
