import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LinkOutlined, FireOutlined } from "@ant-design/icons";
// Убедись, что файл называется именно так и лежит в той же папке
import styles from "./CoinCard.module.css";

const formatCompactLiqPerCoin = (num) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

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

  return (
    <Card
      hoverable
      onClick={() => navigate(linkTo)}
      bordered={false}
      // Подключаем основной стиль карточки
      className={styles.card}
      title={
        <div className={styles.headerContainer}>
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={title}
              // В CSS это .coinIcon
              className={styles.coinIcon}
            />
          ) : (
            // В CSS это .fallbackIcon
            <div className={styles.fallbackIcon}>{title[0]}</div>
          )}

          <div className={styles.titleWrapper}>
            {/* В CSS это .coinName */}
            <span className={styles.coinName}>{title}</span>
            {/* В CSS это .subInfo */}
            <span className={styles.subInfo}>
              Top Liquidation 24H:
              {/* В CSS это .badge */}
              <span className={styles.badge}>
                {formatCompactLiqPerCoin(max24h)}
              </span>
            </span>
          </div>
        </div>
      }
    >
      {/* В CSS это .gridContainer */}
      <div className={styles.gridContainer}>
        {safeData.length === 0 && (
          <div className={styles.emptyState}>Waiting for liquidations...</div>
        )}

        {safeData.slice(0, 3).map((liq, index) => (
          <div key={index} className={styles.liqRow}>
            {/* В CSS это .liqInfo */}
            <div className={styles.liqInfo}>
              <FireOutlined style={{ color: "#ff4d4f", fontSize: "14px" }} />
              {/* В CSS это .amount */}
              <span className={styles.amount}>
                $
                {liq.usd_amount?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>

              {/* Логика выбора цвета: SHORT (зеленый) или LONG (красный) */}
              <span
                className={`${styles.typeTag} ${
                  liq.liq_type ? styles.typeShort : styles.typeLong
                }`}
              >
                {liq.liq_type ? "SHORT" : "LONG"}
              </span>
            </div>

            <div className={styles.priceCol}>
              <div className={styles.priceLabel}>Price</div>
              <div className={styles.priceValue}>
                {Number(liq.price).toLocaleString()}
              </div>
            </div>

            <a
              href={`https://app.lighter.xyz/explorer/logs/${liq.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.linkBtn}
            >
              <LinkOutlined />
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
};
