import React, { useState, useCallback } from "react";
import { AppHeader } from "../Components/AppHeader";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { Spin, Pagination } from "antd"; // <--- Добавили Pagination
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import "./LitTradesPage.css";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

const formatId = (id) => {
  if (!id) return "Unknown";
  if (id.length < 10) return id;
  return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
};

const formatMoney = (val) => Math.round(val).toLocaleString("en-US");

export const LitTradesPage = () => {
  const [whaleStats, setWhaleStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // <--- Текущая страница
  const pageSize = 5; // <--- Элементов на странице

  const handleSocketMessage = useCallback((event) => {
    try {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "spot_whale_stats") {
        setWhaleStats(parsedData.data);
      }
    } catch (e) {
      console.error("WS Parse Error:", e);
    }
  }, []);

  const { status } = useSocketConnection(SOCKET_URL, handleSocketMessage);

  const getStats = () => {
    if (!whaleStats?.marketRatio)
      return { buyPct: 50, sellPct: 50, ratio: "0.00" };
    const { buy_vol, sell_vol } = whaleStats.marketRatio;
    const total = buy_vol + sell_vol;

    if (total === 0) return { buyPct: 50, sellPct: 50, ratio: "0.00" };

    const buyPct = (buy_vol / total) * 100;
    const sellPct = 100 - buyPct;
    const ratio = sell_vol > 0 ? (buy_vol / sell_vol).toFixed(2) : "∞";

    return { buyPct, sellPct, ratio };
  };

  const { buyPct, sellPct, ratio } = getStats();

  // Логика пагинации
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <>
      <AppHeader />

      <div className="lit-trades-container">
        {/* RATIO BAR */}
        <div className="glass-card ratio-container">
          <div className="ratio-stats">
            <span className="text-sell">
              Sellers Vol: {sellPct.toFixed(1)}%
            </span>
            <span
              style={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SwapOutlined /> Market Ratio: {ratio}
            </span>
            <span className="text-buy">Buyers Vol: {buyPct.toFixed(1)}%</span>
          </div>

          <div className="progress-track">
            <div className="center-line" />
            <div
              className="progress-segment bg-sell"
              style={{ width: `${sellPct}%` }}
            />
            <div
              className="progress-segment bg-buy"
              style={{ width: `${buyPct}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        {!whaleStats ? (
          <div style={{ textAlign: "center", marginTop: 100, color: "#aaa" }}>
            <Spin size="large" />
            <p style={{ marginTop: 20 }}>Loading Data...</p>
          </div>
        ) : (
          <>
            <div className="trades-grid">
              {/* LEFT COLUMN: SELLERS */}
              <div className="glass-card">
                <div className="card-header">
                  <ArrowDownOutlined
                    className="text-sell"
                    style={{ fontSize: 20 }}
                  />
                  <h3 className="card-title text-sell">Top Sellers (24h)</h3>
                </div>
                <ul className="trade-list">
                  {whaleStats.topSellers
                    .slice(startIndex, endIndex) // <--- Режем массив
                    .map((seller, idx) => (
                      <li key={idx} className="trade-item">
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#8b949e",
                              fontSize: 12,
                              minWidth: "25px", // Чуть расширил под двузначные числа
                            }}
                          >
                            {/* <--- Правильный расчет ранга: #6, #7 и т.д. */}#
                            {startIndex + idx + 1}
                          </span>
                          <a
                            href={`https://app.lighter.xyz/explorer/accounts/${seller.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wallet-badge"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                            }}
                          >
                            {formatId(seller.id)}
                          </a>
                        </div>
                        <span className="amount-text text-sell">
                          - ${formatMoney(seller.sold)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* RIGHT COLUMN: BUYERS */}
              <div className="glass-card">
                <div className="card-header">
                  <ArrowUpOutlined
                    className="text-buy"
                    style={{ fontSize: 20 }}
                  />
                  <h3 className="card-title text-buy">Top Buyers (24h)</h3>
                </div>
                <ul className="trade-list">
                  {whaleStats.topBuyers
                    .slice(startIndex, endIndex) // <--- Режем массив
                    .map((buyer, idx) => (
                      <li key={idx} className="trade-item">
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#8b949e",
                              fontSize: 12,
                              minWidth: "25px",
                            }}
                          >
                            {/* <--- Правильный расчет ранга */}#
                            {startIndex + idx + 1}
                          </span>
                          <a
                            href={`https://app.lighter.xyz/explorer/accounts/${buyer.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wallet-badge"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              cursor: "pointer",
                            }}
                          >
                            {formatId(buyer.id)}
                          </a>
                        </div>
                        <span className="amount-text text-buy">
                          + ${formatMoney(buyer.bought)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* <--- БЛОК ПАГИНАЦИИ */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
                paddingBottom: "24px",
              }}
            >
              <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
                // Берем длину самого большого списка, чтобы рассчитать кол-во страниц
                total={Math.max(
                  whaleStats.topSellers.length,
                  whaleStats.topBuyers.length
                )}
                showSizeChanger={false} // Убираем выбор "по 10, по 20"
                hideOnSinglePage={true} // Скрыть, если страница всего одна
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
