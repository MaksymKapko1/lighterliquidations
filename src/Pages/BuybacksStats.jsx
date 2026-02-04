import React, { useState, useCallback, useMemo } from "react";
import { AppHeader } from "../Components/AppHeader";
import { useSocketConnection } from "../hooks/useSocketConnection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DatabaseOutlined,
  FireOutlined,
  BarChartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import "./BuybacksStats.css";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

export const BuybacksStats = () => {
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Слушаем сокет
  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);

      // Ловим только наш тип данных (buybacks_update)
      if (msg.type === "buybacks_update") {
        // Данные приходят отсортированные "Новые сверху" (для таблицы ок)
        setDailyStats(msg.data);
        setLoading(false);
      }
    } catch (e) {
      console.error("Error parsing WS message:", e);
    }
  }, []);

  // Подключаемся
  useSocketConnection(SOCKET_URL, handleMessage);

  // 2. Считаем общие суммы (мемоизация, чтобы не пересчитывать при каждом рендере)
  const totalVolume = useMemo(() => {
    return dailyStats.reduce((acc, curr) => acc + curr.volume, 0);
  }, [dailyStats]);

  const totalTrades = useMemo(() => {
    return dailyStats.reduce((acc, curr) => acc + curr.count, 0);
  }, [dailyStats]);

  // Данные для графика (нам нужен хронологический порядок: старые -> новые)
  const chartData = useMemo(() => {
    return [...dailyStats].reverse();
  }, [dailyStats]);

  // Кастомный тултип при наведении на график
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <div className="tooltip-row">
            <span>Vol:</span>
            <span className="tooltip-val text-green">
              ${data.volume.toLocaleString()}
            </span>
          </div>
          <div className="tooltip-row">
            <span>Trades:</span>
            <span className="tooltip-val">{data.count}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <AppHeader />
      <div className="buybacks-page">
        <div className="buybacks-container">
          {/* Заголовок страницы */}
          <div className="page-header">
            <h2>
              <FireOutlined style={{ color: "#ff4d4f" }} /> $LIT Buyback
              Statistics
            </h2>
            <p className="subtitle">
              Tracking on-chain buybacks from Fee Collector & MM accounts
            </p>
          </div>

          {/* Карточки со статистикой */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <DatabaseOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Volume Bought</span>
                <span className="stat-value text-green">
                  $
                  {totalVolume.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <HistoryOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Executed Trades</span>
                <span className="stat-value">
                  {totalTrades.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Можно добавить третью карточку, например "Last 24h Vol" если посчитать */}
            <div className="stat-card">
              <div className="stat-icon-wrapper orange">
                <BarChartOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">Days Active</span>
                <span className="stat-value">{dailyStats.length}</span>
              </div>
            </div>
          </div>

          {/* Секция Графика */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Daily Buyback Volume</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2b303b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#8b949e"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tickFormatter={(tick) => {
                      const d = new Date(tick);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="#8b949e"
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === chartData.length - 1 ? "#4caf50" : "#2ea043"
                        }
                        fillOpacity={index === chartData.length - 1 ? 1 : 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Секция Таблицы */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Detailed Logs</h3>
            </div>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className="text-right">Volume (USD)</th>
                    <th className="text-right">Trades Count</th>
                    <th className="text-right">Avg. Trade Size</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="loading-cell">
                        Connecting to data feed...
                      </td>
                    </tr>
                  ) : (
                    dailyStats.map((day, idx) => (
                      <tr key={idx}>
                        <td className="date-cell">{day.date}</td>
                        <td className="text-right amount-cell">
                          $
                          {day.volume.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-right">{day.count}</td>
                        <td className="text-right dim-text">
                          $
                          {day.count > 0
                            ? (day.volume / day.count).toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
