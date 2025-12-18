import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Row, Col, Spin, ConfigProvider, Button } from "antd";
import {
  ArrowLeftOutlined,
  FireOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { useLiquidations } from "../hooks/useLiquidations";

const TimeSelector = ({ value, onChange }) => {
  const options = [
    { label: "1H", value: 1 },
    { label: "4H", value: 4 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
    { label: "48H", value: 48 },
  ];

  return (
    <div style={styles.timeSelectorContainer} className="hide-scrollbar">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              ...styles.timeOption,
              ...(isActive
                ? styles.timeOptionActive
                : styles.timeOptionInactive),
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
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

const StatBox = ({ title, value, icon, color = "#fff", isLoading }) => (
  <div style={styles.statBox}>
    <div style={styles.statTitle}>
      {icon} {title}
    </div>
    <div
      style={{ ...styles.statValue, color, textShadow: `0 0 20px ${color}40` }}
    >
      {isLoading ? <Spin size="small" /> : value}
    </div>
  </div>
);

export const CoinLiquidationPage = () => {
  const { coin } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(24);

  const { liquidations, lastStats, openInterest, sendRequest, isReady } =
    useLiquidations(timeRange);

  useEffect(() => {
    if (isReady && coin) {
      sendRequest({
        type: "get_stats",
        coin: coin,
        hours: timeRange,
      });
    }
  }, [coin, timeRange, isReady, sendRequest]);

  const currentOI = openInterest?.[coin];

  const tableData = useMemo(() => {
    const data = liquidations[coin] || [];
    return [...data].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [liquidations, coin]);

  const columns = useMemo(
    () => [
      {
        title: "TX HASH",
        dataIndex: "tx_hash",
        width: 140,
        render: (hash) => (
          <a
            href={`https://app.lighter.xyz/explorer/logs/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            <LinkOutlined />
            {hash ? `${hash.slice(0, 4)}...${hash.slice(-4)}` : "LINK"}
          </a>
        ),
      },
      {
        title: "SIDE",
        dataIndex: "liq_type",
        width: 100,
        align: "center",
        render: (isShort) => {
          const color = isShort ? "#3fb950" : "#f85149";
          const bg = isShort
            ? "rgba(63, 185, 80, 0.15)"
            : "rgba(248, 81, 73, 0.15)";
          return (
            <span
              style={{
                ...styles.badge,
                color,
                background: bg,
                border: `1px solid ${color}30`,
                boxShadow: `0 0 8px ${color}20`,
              }}
            >
              {isShort ? "SHORT" : "LONG"}
            </span>
          );
        },
      },
      {
        title: "AMOUNT",
        dataIndex: "usd_amount",
        align: "right",
        render: (v) => (
          <div style={styles.amountCell}>
            <FireOutlined
              style={{ color: "#f85149", fontSize: "12px", opacity: 0.8 }}
            />
            <span style={styles.amountText}>
              ${v?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        ),
      },
      {
        title: "PRICE",
        dataIndex: "price",
        align: "right",
        render: (price) => (
          <span style={styles.monoText}>${Number(price).toLocaleString()}</span>
        ),
      },
      {
        title: "SIZE",
        dataIndex: "size",
        align: "right",
        render: (size) => (
          <span style={{ color: "#8b949e", fontSize: "12px", opacity: 0.7 }}>
            {Number(size).toFixed(4)} {coin}
          </span>
        ),
      },
      {
        title: "TIME",
        dataIndex: "timestamp",
        align: "right",
        width: 120,
        render: (t) => (
          <span style={{ color: "#6b7280", fontSize: "12px" }}>
            {new Date(t).toLocaleTimeString()}
          </span>
        ),
      },
    ],
    [coin]
  );

  return (
    <div style={styles.pageContainer}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={styles.backButton}
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </Button>

      <div style={styles.header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={styles.title}>
            {coin} <span style={styles.gradientText}>Liquidations</span>
          </h1>
          <span style={styles.subtitle}>Real-time liquidation monitoring</span>
        </div>
        <TimeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <StatBox
            title={`Total Liquidations (${timeRange}h)`}
            value={`$${
              lastStats?.vol?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              }) || 0
            }`}
            icon={
              <FireOutlined style={{ color: "#ff4d4f", fontSize: "16px" }} />
            }
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatBox
            title={`Max Single Liquidation`}
            value={`$${
              lastStats?.max?.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              }) || 0
            }`}
            icon={
              <ThunderboltOutlined
                style={{ color: "#faad14", fontSize: "16px" }}
              />
            }
            color="#faad14"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatBox
            title={`${coin} Open Interest`}
            value={
              currentOI
                ? `$${currentOI.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`
                : "Loading..."
            }
            isLoading={!currentOI}
            icon={<span style={styles.oiDot}></span>}
            color="#3fb950"
          />
        </Col>
      </Row>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={styles.liveIndicator}></div>
            <h3 style={styles.tableTitle}>LIVE FEED</h3>
          </div>
          <div style={{ fontSize: "12px", color: "#8b949e" }}>
            Waiting for next liquidation...
          </div>
        </div>

        <ConfigProvider theme={antdTheme}>
          <Table
            dataSource={tableData}
            columns={columns}
            rowKey="tx_hash"
            pagination={{ pageSize: 10, position: ["bottomCenter"] }}
            scroll={{ x: 800, y: 400 }}
          />
        </ConfigProvider>
      </div>

      <style>{`
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const antdTheme = {
  components: {
    Table: {
      colorBgContainer: "transparent",
      colorText: "#e6edf3",
      colorTextHeading: "#8b949e",
      borderColor: "rgba(48, 54, 61, 0.2)",
      headerBg: "rgba(13, 17, 23, 0.3)",
      headerSplitColor: "transparent",
      rowHoverBg: "rgba(56, 139, 253, 0.03)",
      cellPaddingBlock: 16,
    },
    Pagination: {
      colorText: "#8b949e",
      itemActiveBg: "rgba(56, 139, 253, 0.2)",
      colorPrimary: "#58a6ff",
    },
  },
};

const styles = {
  pageContainer: {
    padding: "30px 5%",
    minHeight: "100vh",
    background: "#0d1117",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  backButton: {
    color: "#8b949e",
    marginBottom: "20px",
    paddingLeft: 0,
    fontSize: "14px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.5)",
    paddingBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    color: "#fff",
    margin: 0,
    fontSize: "32px",
    letterSpacing: "-0.5px",
    fontWeight: "800",
  },
  gradientText: {
    background: "linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 30px rgba(255, 77, 79, 0.3)",
  },
  subtitle: { color: "#8b949e", fontSize: "13px", marginTop: "4px" },
  timeSelectorContainer: {
    background: "rgba(255, 255, 255, 0.03)",
    padding: "4px",
    borderRadius: "12px",
    display: "flex",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(5px)",
    overflowX: "auto",
    maxWidth: "100%",
    gap: "4px",
  },
  timeOption: {
    cursor: "pointer",
    padding: "6px 20px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  timeOptionActive: {
    color: "#fff",
    fontWeight: "600",
    background: "rgba(56, 139, 253, 0.15)",
    border: "1px solid rgba(56, 139, 253, 0.3)",
    boxShadow: "0 0 10px rgba(56, 139, 253, 0.1)",
  },
  timeOptionInactive: {
    color: "#6b7280",
    fontWeight: "500",
    background: "transparent",
    border: "1px solid transparent",
  },
  statBox: {
    background: "rgba(13, 17, 23, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(48, 54, 61, 0.6)",
    borderRadius: "16px",
    padding: "24px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  statTitle: {
    color: "#8b949e",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    marginBottom: "12px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0.9,
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "800",
    fontFamily: "'Roboto Mono', monospace",
    letterSpacing: "-0.5px",
  },
  tableContainer: {
    marginTop: "70px",
    background: "rgba(22, 27, 34, 0.7)",
    borderRadius: "20px",
    border: "1px solid rgba(48, 54, 61, 0.4)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
  },
  tableHeader: {
    padding: "20px 30px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveIndicator: {
    width: "8px",
    height: "8px",
    background: "#f85149",
    borderRadius: "50%",
    boxShadow: "0 0 8px #f85149",
    animation: "pulse 2s infinite",
  },
  tableTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  link: {
    color: "#58a6ff",
    fontFamily: "'Roboto Mono', monospace",
    background: "rgba(56, 139, 253, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "800",
    fontSize: "10px",
    letterSpacing: "0.5px",
  },
  amountCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
  },
  amountText: {
    color: "#e6edf3",
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: "700",
    fontSize: "15px",
    textShadow: "0 0 10px rgba(248, 81, 73, 0.2)",
  },
  monoText: {
    color: "#8b949e",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
  },
  oiDot: {
    width: 8,
    height: 8,
    background: "#3fb950",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 8px #3fb950",
  },
};
