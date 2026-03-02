import React, { useState } from "react";
import {
  Layout,
  Button,
  Drawer,
  Modal,
  Typography,
  ConfigProvider,
  theme,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FireOutlined,
  LineChartOutlined,
  GiftOutlined,
  AreaChartOutlined,
  MenuOutlined,
  BuildOutlined,
  HeartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import "./AppHeader.css";

const { Header } = Layout;
const { Text } = Typography;

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
    />
    <path d="M17 3v2" style={{ stroke: "#4caf50" }} />
    <path d="M17 17v3" style={{ stroke: "#4caf50" }} />
    <rect
      x="5"
      y="14"
      width="4"
      height="6"
      rx="1"
      style={{ fill: "#f44336", stroke: "#f44336" }}
    />
    <path d="M7 10v4" style={{ stroke: "#f44336" }} />
    <path d="M7 20v2" style={{ stroke: "#f44336" }} />
  </svg>
);

export const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const isSpot = location.pathname === "/spot";
  const isAirdrop = location.pathname === "/airdrop";
  const isLitTrade = location.pathname === "/littrades";
  const isBuybackStats = location.pathname === "/buybacks";
  const isHeatmap = location.pathname === "/heatmap";

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

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
    width: "100%",
  });

  const NavLinks = () => (
    <>
      {!isHeatmap ? (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/heatmap")}>
          <BarChartOutlined /> Heatmap
        </div>
      ) : (
        <div style={navBtnStyle(false)} onClick={() => handleNav("/")}>
          <FireOutlined /> Liquidations
        </div>
      )}
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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Header
        className="app-header"
        style={{ background: "rgba(13, 17, 23, 0.8)", padding: "0 20px" }}
      >
        <div className="header-inner">
          <div className="header-left-section">
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
              <span className="logo-text">LighterStatsX</span>
            </Link>

            <div className="extra-links-desktop">
              <a
                href="https://app.lighter.xyz/?referral=32734YLV"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-trade"
              >
                Trade on Lighter
              </a>
              <a
                href="https://x.com/LighterLiq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-x"
              >
                Follow on X
              </a>
              <div
                className="btn-donate"
                onClick={() => setIsDonationModalOpen(true)}
              >
                <HeartOutlined style={{ marginRight: "6px" }} /> Donations
              </div>
            </div>
          </div>

          <div className="desktop-nav-group">
            <NavLinks />
          </div>

          <Button
            className="mobile-burger-btn"
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
            onClick={() => setMobileMenuOpen(true)}
          />

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
            drawerStyle={{ background: "#0d1117" }}
          >
            <div className="mobile-nav-container">
              <NavLinks />
            </div>

            <div className="extra-links-mobile">
              <a
                href="https://app.lighter.xyz/?referral=32734YLV"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-trade"
              >
                Trade on Lighter
              </a>
              <a
                href="https://x.com/LighterLiq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-x"
              >
                Follow on X
              </a>
              <div
                className="btn-donate"
                onClick={() => {
                  setIsDonationModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <HeartOutlined style={{ marginRight: "6px" }} /> Donations
              </div>
            </div>
          </Drawer>
        </div>
      </Header>

      <Modal
        title={
          <span style={{ color: "#e6edf3", fontSize: "18px" }}>
            Support the Project
          </span>
        }
        open={isDonationModalOpen}
        onCancel={() => setIsDonationModalOpen(false)}
        footer={null}
        styles={{
          body: { background: "#ffffff00", padding: "10px 0" },
          content: {
            background: "#161b2200",
            border: "1px solid #30363d",
            borderRadius: "12px",
          },
          header: {
            background: "#161b2200",
            borderBottom: "1px solid #30363d",
            paddingBottom: "15px",
          },
        }}
        closeIcon={
          <span style={{ color: "#8b949e", fontSize: "16px" }}>✕</span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#8b949e", margin: 0 }}>
            If you find this tool useful, you can support its development by
            sending a donation to the addresses below:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{ color: "#c9d1d9", fontWeight: 500, fontSize: "14px" }}
            >
              EVM (Ethereum, Arbitrum, etc.)
            </span>
            <div
              style={{
                background: "#0d1117",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #30363d",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                copyable={{
                  text: "0x2DD48b801FD0eD637d8131DB7b99514a3bc81e60",
                }}
                style={{ color: "#58a6ff", wordBreak: "break-all" }}
              >
                0x2DD48b801FD0eD637d8131DB7b99514a3bc81e60
              </Text>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{ color: "#c9d1d9", fontWeight: 500, fontSize: "14px" }}
            >
              Solana (SOL)
            </span>
            <div
              style={{
                background: "#0d1117",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #30363d",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                copyable={{
                  text: "97TqKNTw7ZgHWpUDs2mYn4f1TWeLnGNFTRn3QufgD5Gh",
                }}
                style={{ color: "#58a6ff", wordBreak: "break-all" }}
              >
                97TqKNTw7ZgHWpUDs2mYn4f1TWeLnGNFTRn3QufgD5Gh
              </Text>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
