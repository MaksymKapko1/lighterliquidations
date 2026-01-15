import React from "react";
import "./AirdropStats.css"; // Импортируем стили
import { Spin } from "antd";

export const AirdropStats = ({ stats }) => {
  if (!stats) {
    return (
      <div
        className="stats-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px", // Чтобы блок не скакал по высоте
          background: "#0f172a",
          borderRadius: "12px",
          border: "1px solid #1e293b",
        }}
      >
        <Spin size="large" tip="Loading analytics..." />
      </div>
    );
  }

  const { global, tiers, progress } = stats;

  const formatNum = (num) => new Intl.NumberFormat("en-US").format(num);

  return (
    <div className="stats-container">
      {/* --- HEADER --- */}
      <div className="stats-header">
        <div className="stats-title">
          📊 Airdrop Analytics{" "}
          <span
            style={{
              opacity: 0.5,
              fontSize: "16px",
              fontWeight: "normal",
              marginLeft: "8px",
              color: "#ADD8E6", // Небольшой отступ
            }}
          >
            (Includes only Top 2000 accounts & $LIT staking )
            {/* 155026023.413999999789666617289185523986816406250 */}
          </span>
          <div className="live-dot" title="Live Updates"></div>
        </div>

        {/* <div className="progress-wrapper">
          <div className="progress-text">
            Scanned: {progress.checked} / {progress.total}
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${(progress.checked / progress.total) * 100}%` }}
            ></div>
          </div>
        </div> */}
      </div>

      {/* --- CARDS --- */}
      <div className="stats-grid">
        <div className="stat-card card-dark-red">
          <div className="card-icon">💀</div>
          <div className="card-label">Dumped All</div>
          <div className="card-value val-dark-red">{global.sold_all_pct}%</div>
          <div className="card-desc">Zero Balance</div>
        </div>
        {/* Paper Hands */}
        <div className="stat-card card-red">
          <div className="card-icon">📉</div>
          <div className="card-label">Paper Hands (Sold)</div>
          <div className="card-value val-red">{global.paper_pct}%</div>
          <div className="card-desc">Sold &gt; 50% of airdrop</div>
        </div>

        {/* Diamond Hands */}
        <div className="stat-card card-blue">
          <div className="card-icon">💎</div>
          <div className="card-label">Diamond Hands (Held)</div>
          <div className="card-value val-blue">{global.diamond_pct}%</div>
          <div className="card-desc">Holding &gt; 50% allocation</div>
        </div>

        {/* Chads */}
        <div className="stat-card card-green">
          <div className="card-icon">🚀</div>
          <div className="card-label">Chads (Accumulating)</div>
          <div className="card-value val-green">{global.increased_pct}%</div>
          <div className="card-desc">Increased position</div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="tiers-table-container">
        <table className="tiers-table">
          <thead>
            <tr>
              <th>Group Tier</th>
              <th>Users</th>
              <th>Total Dropped</th>
              <th>Current Holdings</th>
              <th>Staked $LIT</th>
              <th style={{ textAlign: "right" }}>Retention %</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: "bold", color: "#fff" }}>
                  {tier.name}
                </td>
                <td>{tier.users}</td>
                <td style={{ fontFamily: "monospace" }}>
                  {formatNum(tier.dropped)}
                </td>
                <td style={{ fontFamily: "monospace", color: "violet" }}>
                  {formatNum(tier.holding)}
                </td>
                <td style={{ fontFamily: "monospace" }}>
                  {formatNum(tier.staked)}
                </td>
                <td style={{ textAlign: "right" }}>
                  <span
                    className={`retention-badge ${
                      tier.retention_pct > 80
                        ? "badge-high"
                        : tier.retention_pct > 50
                        ? "badge-mid"
                        : "badge-low"
                    }`}
                  >
                    {tier.retention_pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
