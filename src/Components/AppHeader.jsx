import React from "react";
import { Layout, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FireOutlined,
  HomeOutlined,
  LineChartOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const CandleIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="15"
      y="5"
      width="4"
      height="12"
      rx="1"
      style={{ fill: "#4caf50", stroke: "#4caf50" }}
    />{" "}
    <path d="M17 3v2" style={{ stroke: "#4caf50" }} />
    <path d="M17 17v3" style={{ stroke: "#4caf50" }} />
    <rect
      x="5"
      y="14"
      width="4"
      height="6"
      rx="1"
      style={{ fill: "#f44336", stroke: "#f44336" }}
    />{" "}
    <path d="M7 10v4" style={{ stroke: "#f44336" }} />
    <path d="M7 20v2" style={{ stroke: "#f44336" }} />
  </svg>
);

export const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSpot = location.pathname === "/spot";
  const isAirdrop = location.pathname === "/airdrop";

  const navBtnStyle = (active) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    background: active ? "rgba(56, 139, 253, 0.2)" : "transparent",
    color: active ? "#58a6ff" : "#8b949e",
    border: active
      ? "1px solid rgba(56, 139, 253, 0.4)"
      : "1px solid transparent",
  });

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 20px",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              filter: "drop-shadow(0 0 5px rgba(76, 175, 80, 0.5))",
            }}
          >
            <CandleIcon />
          </div>

          <span
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: "1px",
            }}
          >
            Lighter Liquidations
          </span>
        </Link>
        {!isSpot ? (
          <div style={navBtnStyle(false)} onClick={() => navigate("/spot")}>
            <LineChartOutlined /> Spot Market
          </div>
        ) : (
          <div style={navBtnStyle(false)} onClick={() => navigate("/")}>
            <FireOutlined /> Liquidations
          </div>
        )}
        {!isAirdrop ? (
          <div style={navBtnStyle(false)} onClick={() => navigate("/airdrop")}>
            <GiftOutlined /> Airdrop Statistics
          </div>
        ) : (
          <div style={navBtnStyle(false)} onClick={() => navigate("/")}>
            <FireOutlined /> Liquidations
          </div>
        )}
      </div>
    </Header>
  );
};
