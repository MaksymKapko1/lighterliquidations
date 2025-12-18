import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LinkOutlined, FireOutlined } from "@ant-design/icons";

export const CoinCard = ({
  title,
  symbol,
  iconUrl,
  data = [],
  linkTo,
  max24h,
}) => {
  const navigate = useNavigate();
  const safeData = Array.isArray(data) ? data : [];

  const formatCompactLiqPerCoin = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <Card
      hoverable
      onClick={() => navigate(linkTo)}
      bordered={false}
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
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={title}
              style={{ width: "28px", height: "28px", borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#f7931a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {title[0]}
            </div>
          )}

          {/* Исправленный контейнер заголовка */}
          <div
            style={{
              display: "flex",
              alignItems: "center", // Выравнивание строго по центру
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span
              style={{ letterSpacing: "1px", color: "#fff", fontSize: "16px" }}
            >
              {title}
            </span>
            <span
              style={{
                letterSpacing: "0.5px",
                fontSize: "14px", // Чуть меньше, чтобы влезало лучше
                color: "#8b949e",
                whiteSpace: "nowrap", // Запрет разрыва фразы
                display: "flex",
                alignItems: "center",
              }}
            >
              Top Liquidation for 24H:
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "8px",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "14px",
                  fontFamily: "'Roboto Mono', monospace",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                  textShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
                  letterSpacing: "0.5px",
                }}
              >
                {formatCompactLiqPerCoin(max24h)}
              </span>
            </span>
          </div>
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

              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "4px",

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
