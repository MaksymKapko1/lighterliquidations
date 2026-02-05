import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FireOutlined,
  LineChartOutlined,
  GiftOutlined,
  AreaChartOutlined,
  MenuOutlined,
  BuildOutlined, // Иконка бургера
} from "@ant-design/icons";
import "./AppHeader.css";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Состояние меню

  const isSpot = location.pathname === "/spot";
  const isAirdrop = location.pathname === "/airdrop";
  const isLitTrade = location.pathname === "/littrades";
  const isBuybackStats = location.pathname === "/buybacks";

  // Функция навигации + закрытие меню на мобилке
  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Общий стиль для кнопок (и десктоп, и мобилка)
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
    width: "100%", // Растягиваем в мобильном меню
  });

  // Список кнопок (вынесли в отдельную переменную, чтобы не дублировать код)
  const NavLinks = () => (
    <>
      {!isSpot ? (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/spot")}>
          <LineChartOutlined /> Spot Market
        </div>
      ) : (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/")}>
          <FireOutlined /> Liquidations
        </div>
      )}

      {!isAirdrop ? (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/airdrop")}>
          <GiftOutlined /> Airdrop Statistics
        </div>
      ) : (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/")}>
          <FireOutlined /> Liquidations
        </div>
      )}

      {!isLitTrade ? (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/littrades")}>
          <AreaChartOutlined /> $LIT Trades
        </div>
      ) : (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/")}>
          <FireOutlined /> Liquidations
        </div>
      )}

      {!isBuybackStats ? (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/buybacks")}>
          <BuildOutlined /> Buybacks
        </div>
      ) : (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/")}>
          <FireOutlined /> Liquidations
        </div>
      )}
    </>
  );

  return (
    <Header className="app-header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              filter: "drop-shadow(0 0 5px rgba(76, 175, 80, 0.5))",
            }}
          >
            <CandleIcon />
          </div>
          <span className="logo-text">Lighter Liquidations</span>
        </Link>

        {/* --- DESKTOP MENU (Скрыто на мобильных) --- */}
        <div className="desktop-nav-group">
          <NavLinks />
        </div>

        {/* --- MOBILE BURGER BUTTON (Видно только на мобильных) --- */}
        <Button
          className="mobile-burger-btn"
          type="text"
          icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
          onClick={() => setMobileMenuOpen(true)}
        />

        {/* --- MOBILE DRAWER (Выезжающее меню) --- */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{
            body: { background: "#0d1117", padding: "20px" },
            header: {
              background: "#161b22",
              borderBottom: "1px solid #30363d",
            },
            mask: { backdropFilter: "blur(4px)" },
          }}
          drawerStyle={{ background: "#0d1117" }} // Темный фон для самого drawer
        >
          <div className="mobile-nav-container">
            <NavLinks />
          </div>
        </Drawer>
      </div>
    </Header>
  );
};
