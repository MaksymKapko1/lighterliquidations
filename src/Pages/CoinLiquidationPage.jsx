import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Row, Col, Spin, ConfigProvider, Button, Segmented } from "antd";
import {
  ArrowLeftOutlined,
  FireOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  LinkOutlined,
} from "@ant-design/icons";

// --- ВСТРОЕННЫЙ ХУК ---
const useLiquidations = () => {
  const [lastStats, setLastStats] = useState({ vol: 0, max: 0 });
  const [liquidations, setLiquidations] = useState({
    BTC: [],
    ETH: [],
    HYPE: [],
  });
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isReady, setIsReady] = useState(false);
  const [openInterest, setOpenInterest] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNetworkOi, setTotalNetworkOi] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const wsRef = useRef(null);

  useEffect(() => {
    // Подставьте ваш реальный адрес WS
    const ws = new WebSocket("ws://localhost:8765");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("Connected 🟢");
      setIsReady(true);
      console.log("WS CONNECTED");
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === "liquidations") {
          const incomingData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setLiquidations((prevState) => {
            const nextState = { ...prevState };
            incomingData.forEach((item) => {
              const coinKey = item.coin || "Unknown";
              if (!nextState[coinKey]) nextState[coinKey] = [];
              nextState[coinKey] = [item, ...nextState[coinKey]].slice(0, 50);
            });
            return nextState;
          });
        } else if (response.type === "stats_update") {
          setLastStats(response.data);
        } else if (response.type === "oi_update_batch") {
          setOpenInterest(response.data);
        } else if (response.type === "global_stats") {
          setTotalUsers(response.data.totalUsers);
          setTotalNetworkOi(response.data.totalNetworkOi);
          setTotalVolume(response.data.totalVolume);
          setNewUsers(response.data.newUsers);
          setRevenue(response.data.revenue);
        }
      } catch (err) {
        console.error("Error processing WS message:", err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected 🔴");
      setIsReady(false);
    };

    return () => ws.close();
  }, []);

  const sendRequest = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return {
    liquidations,
    connectionStatus,
    lastStats,
    sendRequest,
    isReady,
    openInterest,
    totalUsers,
    totalNetworkOi,
    totalVolume,
    newUsers,
    revenue,
  };
};

// --- КОМПОНЕНТ: КРАСИВЫЙ СЕЛЕКТОР ВРЕМЕНИ ---
const TimeSelector = ({ value, onChange }) => {
  const options = [
    { label: "1H", value: 1 },
    { label: "4H", value: 4 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
    { label: "48H", value: 48 },
  ];

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        padding: "4px",
        borderRadius: "12px",
        display: "flex",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(5px)",
      }}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              cursor: "pointer",
              padding: "6px 20px",
              borderRadius: "8px",
              color: isActive ? "#fff" : "#6b7280",
              fontWeight: isActive ? "600" : "500",
              background: isActive ? "rgba(56, 139, 253, 0.15)" : "transparent",
              border: isActive
                ? "1px solid rgba(56, 139, 253, 0.3)"
                : "1px solid transparent",
              transition: "all 0.3s ease",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: isActive ? "0 0 10px rgba(56, 139, 253, 0.1)" : "none",
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
  );
};

const StatBox = ({ title, value, icon, color = "#fff", isLoading }) => (
  <div
    style={{
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
      transition: "transform 0.2s ease",
    }}
  >
    <div
      style={{
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
      }}
    >
      {icon} {title}
    </div>
    <div
      style={{
        fontSize: "32px",
        fontWeight: "800",
        color: color,
        textShadow: `0 0 20px ${color}40`,
        fontFamily: "'Roboto Mono', monospace",
        letterSpacing: "-0.5px",
      }}
    >
      {isLoading ? <Spin size="small" /> : value}
    </div>
  </div>
);

export const CoinLiquidationPage = () => {
  const { coin } = useParams();
  const navigate = useNavigate();

  const { liquidations, sendRequest, lastStats, isReady, openInterest } =
    useLiquidations();

  const [timeRange, setTimeRange] = useState(24);
  const currentOI = openInterest && openInterest[coin];

  const tableData = liquidations[coin] || [];

  useEffect(() => {
    if (!isReady) return;
    sendRequest({
      type: "get_stats",
      coin: coin,
      hours: timeRange,
    });
  }, [coin, timeRange, isReady, sendRequest]);

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
            style={{
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(56, 139, 253, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(56, 139, 253, 0.1)")
            }
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
                color: color,
                background: bg,
                border: `1px solid ${color}30`,
                padding: "4px 10px",
                borderRadius: "20px",
                fontWeight: "800",
                fontSize: "10px",
                letterSpacing: "0.5px",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <FireOutlined
              style={{ color: "#f85149", fontSize: "12px", opacity: 0.8 }}
            />
            <span
              style={{
                color: "#e6edf3",
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: "700",
                fontSize: "15px",
                textShadow: "0 0 10px rgba(248, 81, 73, 0.2)",
              }}
            >
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
          <span
            style={{
              color: "#8b949e",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "13px",
            }}
          >
            ${Number(price).toLocaleString()}
          </span>
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
    <div
      style={{
        padding: "30px 5%",
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        style={{
          color: "#8b949e",
          marginBottom: "20px",
          paddingLeft: 0,
          fontSize: "14px",
        }}
        onClick={() => navigate("/")}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#58a6ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#8b949e")}
      >
        Back to Dashboard
      </Button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "1px solid rgba(48, 54, 61, 0.5)",
          paddingBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "32px",
              letterSpacing: "-0.5px",
              fontWeight: "800",
            }}
          >
            {coin}{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255, 77, 79, 0.3)",
              }}
            >
              Liquidations
            </span>
          </h1>
          <span
            style={{ color: "#8b949e", fontSize: "13px", marginTop: "4px" }}
          >
            Real-time liquidation monitoring
          </span>
        </div>

        <TimeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <StatBox
            title={`Total Rekt (${timeRange}h)`}
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
            title={`Max Single Rekt`}
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
            icon={
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: "#3fb950",
                  borderRadius: "50%",
                  display: "inline-block",
                  boxShadow: "0 0 8px #3fb950",
                }}
              ></span>
            }
            color="#3fb950"
          />
        </Col>
      </Row>

      <div
        style={{
          marginTop: "70px",
          background: "rgba(22, 27, 34, 0.7)",
          borderRadius: "20px",
          border: "1px solid rgba(48, 54, 61, 0.4)",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            padding: "20px 30px",
            borderBottom: "1px solid rgba(48, 54, 61, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#f85149",
                borderRadius: "50%",
                boxShadow: "0 0 8px #f85149",
                animation: "pulse 2s infinite",
              }}
            ></div>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              LIVE FEED
            </h3>
          </div>
          <div style={{ fontSize: "12px", color: "#8b949e" }}>
            Waiting for next liquidation...
          </div>
        </div>

        <ConfigProvider
          theme={{
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
          }}
        >
          <Table
            dataSource={tableData}
            columns={columns}
            rowKey="tx_hash"
            pagination={{ pageSize: 10, position: ["bottomCenter"] }}
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
