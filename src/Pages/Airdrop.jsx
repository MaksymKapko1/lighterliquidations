import { AppHeader } from "../Components/AppHeader";
import { SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { AirdropSearch } from "../Components/AirdropSearch";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useCallback, useState, useEffect } from "react";
import { TopAllocationsTable } from "../Components/TopAllocationTable";
import {
  FireOutlined,
  LinkOutlined,
  WalletOutlined,
  GifOutlined,
  RubyOutlined,
} from "@ant-design/icons";
import "./AirdropPage.css";

import { useNavigate } from "react-router-dom";

const SOCKET_URL = "ws://localhost:8765";

export const Airdrop = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topList, setTopList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

            {/* Детали */}
            <div className="allocation-details">
              {/* --- СТРОКА 1: ДАННЫЕ ИЗ БАЗЫ (Сколько дали дропа) --- */}
              <div className="detail-row">
                <span className="detail-label">AIRDROP RECEIVED</span>
                <div className="amount-value-container">
                  {/* Иконка Огонька для дропа */}
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

              {/* --- СТРОКА 2: ДАННЫЕ ИЗ API (Сколько сейчас на кошельке) --- */}
              <div className="detail-row">
                <span className="detail-label">CURRENT BALANCE</span>
                <div className="amount-value-container">
                  {/* Иконка Кошелька для баланса */}
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
                    {/* current_balance прилетел из запроса к Elliot API */}
                    {Number(userData.current_balance || 0).toLocaleString()} LIT
                  </span>
                </div>
              </div>

              {/* --- СТРОКА 3: РАЗНИЦА (Продал или купил?) --- */}
              <div className="detail-row">
                <span className="detail-label">CHANGE</span>
                <div className="amount-value-container">
                  <span
                    className="amount-text-large"
                    style={{
                      // Зеленый если баланс больше или равен дропу, Красный если меньше
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

              {/* Ссылка на транзакцию или Адрес */}
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
