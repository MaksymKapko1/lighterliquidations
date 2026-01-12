import React, { useState, useCallback } from "react";
import { AppHeader } from "../Components/AppHeader";
import { useSocketConnection } from "../hooks/useSocketConnection";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

// Красивое форматирование денег
const formatUSD = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const TraderTable = ({ title, data, type }) => {
  const isBuy = type === "buy";
  const color = isBuy ? "#3fb950" : "#f85149";

  return (
    <div
      style={{
        background: "rgba(22, 27, 34, 0.6)",
        borderRadius: "16px",
        border: "1px solid rgba(48, 54, 61, 0.8)",
        flex: 1,
        minWidth: "350px",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid rgba(48, 54, 61, 0.8)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color, fontWeight: "800", letterSpacing: "1px" }}>
          {title.toUpperCase()}
        </span>
        <span style={{ color: "#8b949e", fontSize: "12px" }}>24H Volume</span>
      </div>
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        {data.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid rgba(48, 54, 61, 0.3)",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span
                style={{
                  color: idx < 3 ? "#ffd700" : "#484f58",
                  fontWeight: "bold",
                  width: "20px",
                }}
              >
                {idx + 1}
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#58a6ff",
                    fontFamily: "monospace",
                    fontSize: "14px",
                  }}
                >
                  {row.id.length > 10
                    ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}`
                    : row.id}
                </span>
                <span style={{ color: "#8b949e", fontSize: "11px" }}>
                  {row.trades} trades
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{ color, fontWeight: "700", fontFamily: "monospace" }}
              >
                {formatUSD(isBuy ? row.bought : row.sold)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LitTradesPage = () => {
  const [whaleData, setWhaleData] = useState({
    topBuyers: [],
    topSellers: [],
    marketRatio: { buy_pct: 0, buy_vol: 0, sell_vol: 0 },
  });

  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "spot_whale_stats") setWhaleData(msg.data);
    } catch (e) {
      console.error("WS Error", e);
    }
  }, []);

  const { status } = useSocketConnection(SOCKET_URL, handleMessage);

  const buyPct = whaleData.marketRatio?.buy_pct || 0;
  const sellPct = 100 - buyPct;

  return (
    <div
      style={{
        background: "#0d1117",
        minHeight: "100vh",
        color: "#c9d1d9",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <AppHeader />

      <div
        style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              Whale Tracker
            </h1>
            <p style={{ color: "#8b949e", margin: "5px 0 0 0" }}>
              Real-time large spot market movements
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(48, 54, 61, 0.3)",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              border: "1px solid rgba(48, 54, 61, 0.8)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: status === "Connected" ? "#3fb950" : "#f85149",
                boxShadow: status === "Connected" ? "0 0 10px #3fb950" : "none",
              }}
            />
            {status.toUpperCase()}
          </div>
        </div>

        {/* Sentiment Bar */}
        <div
          style={{
            background: "rgba(22, 27, 34, 0.4)",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid rgba(48, 54, 61, 0.8)",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#3fb950",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              >
                {buyPct}%
              </span>
              <span
                style={{
                  color: "#8b949e",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                BUY PRESSURE
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  color: "#f85149",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              >
                {sellPct.toFixed(2)}%
              </span>
              <span
                style={{
                  color: "#8b949e",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                SELL PRESSURE
              </span>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "14px",
              background: "#30363d",
              borderRadius: "7px",
              overflow: "hidden",
              display: "flex",
              border: "2px solid #0d1117",
            }}
          >
            <div
              style={{
                width: `${buyPct}%`,
                background: "linear-gradient(90deg, #238636, #3fb950)",
                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            <div
              style={{
                width: `${sellPct}%`,
                background: "linear-gradient(90deg, #f85149, #da3633)",
                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>

        {/* Tables Container */}
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <TraderTable
            title="Top Accumulators"
            data={whaleData.topBuyers}
            type="buy"
          />
          <TraderTable
            title="Top Distributors"
            data={whaleData.topSellers}
            type="sell"
          />
        </div>
      </div>
    </div>
  );
};
