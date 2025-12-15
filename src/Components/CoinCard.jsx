import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LinkOutlined, FireOutlined } from "@ant-design/icons";

export const CoinCard = ({ title, iconUrl, data = [], linkTo }) => {
  const navigate = useNavigate();
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card
      hoverable
      onClick={() => navigate(linkTo)}
      bordered={false}
      // --- ОБНОВЛЕНИЕ ДЛЯ ANTD 5.0 ---
      styles={{
        header: {
          borderBottom: "1px solid rgba(48, 54, 61, 0.5)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
        },
        body: {
          padding: "15px",
        },
      }}
      style={{
        cursor: "pointer",
        height: "100%",
        background: "rgba(13, 17, 23, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(48, 54, 61, 0.5)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={iconUrl}
            alt={title}
            style={{ width: "28px", height: "28px", borderRadius: "50%" }}
          />
          <span style={{ letterSpacing: "1px" }}>{title}</span>
        </div>
      }
    >
      <div style={{ display: "grid", gap: "12px" }}>
        {safeData.length === 0 && (
          <div
            style={{ textAlign: "center", color: "#8b949e", padding: "20px 0" }}
          >
            Waiting for liquidations...
          </div>
        )}

        {safeData.slice(0, 3).map((liq, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              // Сетка: 1 часть (сумма), 1 часть (цена), авто-ширина (кнопка)
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr auto",
              alignItems: "center",
              padding: "12px 16px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
            }}
          >
            {/* 1. СУММА (СЛЕВА) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FireOutlined style={{ color: "#ff4d4f", fontSize: "14px" }} />
              <span
                style={{
                  color: "#ff4d4f",
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "monospace",
                  letterSpacing: "0.5px",
                  textShadow: "0 0 10px rgba(255, 77, 79, 0.25)",
                }}
              >
                $
                {liq.usd_amount?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
              {/* TYPE OF LIQ */}
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  // Логика цветов:
                  // Short ликвидация = Покупка (Buy) = Зеленый
                  // Long ликвидация = Продажа (Sell) = Красный
                  color: liq.liq_type ? "#52c41a" : "#ff4d4f",
                  background: liq.liq_type
                    ? "rgba(82, 196, 26, 0.15)"
                    : "rgba(255, 77, 79, 0.15)",
                  border: `1px solid ${
                    liq.liq_type
                      ? "rgba(82, 196, 26, 0.3)"
                      : "rgba(255, 77, 79, 0.3)"
                  }`,
                }}
              >
                {liq.liq_type ? "SHORT" : "LONG"}
              </span>
            </div>

            {/* 2. ЦЕНА (ПО ЦЕНТРУ / БЛИЖЕ К КРАЮ) */}
            <div style={{ textAlign: "right", paddingRight: "15px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                }}
              >
                Price
              </div>
              <div
                style={{
                  color: "#c9d1d9",
                  fontSize: "13px",
                  fontFamily: "monospace",
                }}
              >
                {Number(liq.price).toLocaleString()}
              </div>
            </div>

            {/* 3. КНОПКА (СПРАВА) */}
            <a
              href={`https://app.lighter.xyz/explorer/logs/${liq.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                color: "#58a6ff",
                background: "rgba(56, 139, 253, 0.15)",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                transition: "0.2s",
                border: "1px solid rgba(56, 139, 253, 0.2)",
              }}
            >
              <LinkOutlined />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
};
