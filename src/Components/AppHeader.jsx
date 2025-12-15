import React from "react";
import { Layout, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FireOutlined, HomeOutlined } from "@ant-design/icons";

const { Header } = Layout;

// 👇 1. Определяем иконку прямо тут (или импортируем)
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
    {/* Зеленая свеча */}
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
    {/* Красная свеча */}
    <path d="M7 10v4" style={{ stroke: "#f44336" }} />
    <path d="M7 20v2" style={{ stroke: "#f44336" }} />
  </svg>
);

export const AppHeader = () => {
  const location = useLocation();

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
          {/* 👇 2. Вставляем нашу иконку вместо эмодзи */}
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
              letterSpacing: "1px", // Чуть разрядим шрифт для стиля
            }}
          >
            Lighter Liquidations
          </span>
        </Link>
      </div>
    </Header>
  );
};
