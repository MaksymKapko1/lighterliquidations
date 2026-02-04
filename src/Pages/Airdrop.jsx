import { AppHeader } from "../Components/AppHeader";
import { UserOutlined } from "@ant-design/icons";
import { AirdropSearch } from "../Components/AirdropSearch";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useCallback, useState, useEffect } from "react";
import { TopAllocationsTable } from "../Components/TopAllocationTable";
import { LinkOutlined, WalletOutlined, RubyOutlined } from "@ant-design/icons";
import "./AirdropPage.css";

import { AirdropStats } from "../Components/AirdropStats";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

export const Airdrop = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topList, setTopList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [airdropStats, setAirdropStats] = useState(null);

  const performSearch = (query) => {
    if (!query) return;
    const queryStr = query.toString();
    setSearchQuery(queryStr);
    setLoading(true);
    setUserData(null);
    send({ type: "check_allocation", query: queryStr });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "allocation_result") {
        console.log("🔍 ДАННЫЕ С БЭКЕНДА:", msg.data);
        setLoading(false);
        if (msg.data) {
          setUserData(msg.data);
        } else {
          alert("User not found.");
          setUserData(null);
        }
      }

      if (msg.type === "top100_result") {
        setTopList(msg.data);
        setTableLoading(false);
      }
      if (msg.type === "airdrop_stats_update") {
        setAirdropStats(msg.data);
      }
    } catch (e) {
      console.error("Error parsing message:", e);
    }
  }, []);

  const { send, status } = useSocketConnection(SOCKET_URL, handleMessage);

  useEffect(() => {
    if (status === "Connected") {
      send({ type: "get_top_100" });
    }
  }, [status, send]);

  const handleSearchRequest = (query) => {
    setLoading(true);
    setUserData(null);
    send({ type: "check_allocation", query: query });
  };

  return (
    <>
      <AppHeader />
      <div className="airdrop-page-container">
        <div style={{ marginTop: "20px" }}>
          <AirdropStats stats={airdropStats} />
        </div>
        <header className="airdrop-header">
          <AirdropSearch
            onSearch={performSearch}
            isLoading={loading}
            externalValue={searchQuery} // Передаем текущее значение
            setExternalValue={setSearchQuery}
          />
        </header>

        {/* --- НОВАЯ КАРТОЧКА РЕЗУЛЬТАТА --- */}
        {userData && (
          <div className="allocation-result-container">
            {/* Заголовок карточки */}
            <div className="allocation-header">
              <div className="live-indicator-success"></div>
              <h3 className="allocation-title">ALLOCATION FOUND</h3>
            </div>

            <div className="allocation-details">
              <div className="detail-row">
                <span className="detail-label">ACCOUNT INDEX</span>
                <div className="amount-value-container">
                  <UserOutlined
                    style={{ color: "#e6edf3", fontSize: "18px" }}
                  />
                  <span
                    className="mono-text"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    {Number(userData.user_id).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-label">AIRDROP RECEIVED</span>
                <div className="amount-value-container">
                  <RubyOutlined
                    style={{ color: "#e6edf3", fontSize: "18px" }}
                  />
                  <span
                    className="mono-text"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    {/* amount берется из твоей SQL базы */}
                    {Number(userData.amount).toLocaleString()} LIT
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">CURRENT BALANCE</span>
                <div className="amount-value-container">
                  <WalletOutlined
                    style={{ color: "#58a6ff", fontSize: "18px" }}
                  />
                  <span
                    className="mono-text"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#58a6ff",
                    }}
                  >
                    {Number(userData.current_balance || 0).toLocaleString()} LIT
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">CHANGE</span>
                <div className="amount-value-container">
                  <span
                    className="amount-text-large"
                    style={{
                      color:
                        userData.difference >= -0.01 ? "#2ea043" : "#da3633",
                      fontSize: "20px",
                    }}
                  >
                    {userData.difference > 0 ? "+" : ""}
                    {Number(userData.difference).toLocaleString()} LIT
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">TX HASH</span>
                {userData.tx_hash ? (
                  <a
                    href={`https://app.lighter.xyz/explorer/logs/${userData.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    <LinkOutlined />
                    View Claim TX
                  </a>
                ) : (
                  <span className="mono-text">{userData.user_id}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Таблица Топ-100 */}
        {/* Убрали инлайн стили центрирования, теперь это делает CSS контейнера */}
        <TopAllocationsTable
          data={topList}
          isLoading={tableLoading}
          onUserClick={performSearch}
        />
      </div>
    </>
  );
};
