import React, { useState, useCallback, useMemo } from "react";
import { AppHeader } from "../Components/AppHeader";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
} from "@ant-design/icons";
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
  WalletOutlined,
  DollarOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import "./BuybacksStats.css";

const SOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

export const BuybacksStats = () => {
  const [dailyStats, setDailyStats] = useState([]);
  const [balances, setBalances] = useState({ lit: 0, usdc: 0 });
  const [loading, setLoading] = useState(true);

  const [timeRange, setTimeRange] = useState("30d");
  const [stakingStats, setStakingStats] = useState(null);

  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "buybacks_update") {
        console.log("🔥 RECEIVED DATA:", msg.data);
        // Теперь мы ждем структуру { stats: [], balances: {} }
        if (msg.data.stats) setDailyStats(msg.data.stats);
        if (msg.data.balances) setBalances(msg.data.balances);
        setLoading(false);
      }

      if (msg.type === "global_stats" && msg.data.staking_stats) {
        setStakingStats(msg.data.staking_stats);
      }
    } catch (e) {
      console.error("Error parsing WS message:", e);
    }
  }, []);

  useSocketConnection(SOCKET_URL, handleMessage);

  const StakingPeriodCard = ({ title, data }) => {
    if (!data) return null;
    const isPositive = data.net_flow > 0;

    return (
      <div className="staking-sub-card">
        <span className="staking-period-label">{title}</span>
        <div className="staking-row">
          <span className="text-dim">Staked:</span>
          <span className="text-green">+{data.staked.toLocaleString()}</span>
        </div>
        <div className="staking-row">
          <span className="text-dim">Unstaked:</span>
          <span className="text-red">-{data.unstaked.toLocaleString()}</span>
        </div>
        <div className={`net-flow-badge ${isPositive ? "pos" : "neg"}`}>
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(data.net_flow).toLocaleString()} LIT
        </div>
      </div>
    );
  };
  // 1. Фильтруем данные для графика в зависимости от свитчера
  const chartData = useMemo(() => {
    // Копируем и реверсируем (чтобы шло слева направо по времени)
    let data = [...dailyStats].reverse();

    // 👇 ДОБАВЛЕНА ЛОГИКА ДЛЯ 7 ДНЕЙ
    if (timeRange === "7d") {
      data = data.slice(-7);
    } else if (timeRange === "30d") {
      // Берем последние 30 элементов
      data = data.slice(-30);
    }
    return data;
  }, [dailyStats, timeRange]);

  // 2. Считаем средний дневной байбек (Card 3)
  const avgDailyBuyback = useMemo(() => {
    if (dailyStats.length === 0) return 0;
    const totalVol = dailyStats.reduce((acc, curr) => acc + curr.volume, 0);
    return totalVol / dailyStats.length;
  }, [dailyStats]);

  // Кастомный тултип
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
          <div className="dashboard-section staking-section">
            <div className="section-header-row">
              <h3>
                <SwapOutlined /> Staking Net Flow Insights
              </h3>
            </div>

            <div className="staking-grid">
              <StakingPeriodCard
                title="Last 24 Hours"
                data={stakingStats?.day}
              />
              <StakingPeriodCard
                title="Last 3 Days"
                data={stakingStats?.three_days}
              />
              <StakingPeriodCard
                title="Last 7 Days"
                data={stakingStats?.week}
              />
            </div>
          </div>
          {/* <div className="page-header">
            <h2>$LIT Buybacks Stats</h2>
          </div> */}

          {/* --- КАРТОЧКИ --- */}
          <div className="stats-grid">
            {/* Карточка 1: Баланс LIT */}
            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <WalletOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">LIT Treasury Balance</span>
                <span className="stat-value text-green">
                  {balances.lit?.total
                    ? balances.lit.total.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })
                    : "0"}{" "}
                  LIT
                </span>
              </div>
            </div>

            {/* Карточка 2: Баланс USDC */}
            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <DollarOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">USDC Balance (Free)</span>
                <span className="stat-value text-blue">
                  $
                  {balances.usdc?.available
                    ? balances.usdc.available.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : "0"}
                </span>
                <span className="stat-subtext">
                  (Locked): $
                  {balances.usdc?.locked
                    ? balances.usdc.locked.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })
                    : "0"}
                </span>
              </div>
            </div>

            {/* Карточка 3: Средний откуп */}
            <div className="stat-card">
              <div className="stat-icon-wrapper orange">
                <LineChartOutlined />
              </div>
              <div className="stat-content">
                <span className="stat-label">Avg. Daily Buyback</span>
                <span className="stat-value">
                  $
                  {avgDailyBuyback.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* --- ГРАФИК --- */}
          <div className="dashboard-section">
            <div className="section-header-row">
              <h3>Daily Buyback Volume</h3>

              {/* Свитчер времени */}
              <div className="time-switcher">
                {/* 👇 ДОБАВЛЕНА КНОПКА 7 Days */}
                <button
                  className={timeRange === "7d" ? "active" : ""}
                  onClick={() => setTimeRange("7d")}
                >
                  7 Days
                </button>

                <button
                  className={timeRange === "30d" ? "active" : ""}
                  onClick={() => setTimeRange("30d")}
                >
                  30 Days
                </button>
                <button
                  className={timeRange === "all" ? "active" : ""}
                  onClick={() => setTimeRange("all")}
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2b303b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#8b949e"
                    tickFormatter={(tick) => {
                      const d = new Date(tick);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="#8b949e"
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === chartData.length - 1 ? "#4caf50" : "#2ea043"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- ТАБЛИЦА --- */}
          <div className="dashboard-section">
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Date</th>
                    <th className="text-right" style={{ width: "30%" }}>
                      Volume (USD)
                    </th>
                    <th className="text-right" style={{ width: "20%" }}>
                      Trades Count
                    </th>
                    <th className="text-right" style={{ width: "30%" }}>
                      Avg. Trade Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="loading-cell">
                        Loading...
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
