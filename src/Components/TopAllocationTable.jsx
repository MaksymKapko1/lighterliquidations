import React, { useMemo, useState } from "react";
import { Table, ConfigProvider } from "antd";
import {
  FireOutlined,
  LinkOutlined,
  RubyOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

export const TopAllocationsTable = ({ data, isLoading, onUserClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const columns = useMemo(
    () => [
      {
        title: "RANK",
        key: "index",
        width: 80,
        align: "center",
        render: (_, record, index) => {
          // 1. Считаем реальный ранг с учетом страницы
          const currentRank = (currentPage - 1) * pageSize + index + 1;

          let color = "#8b949e"; // Серый по умолчанию
          let icon = null;

          // 2. Проверяем РЕАЛЬНЫЙ ранг (чтобы золото было только у #1, а не у #11, #21...)
          if (currentRank === 1) {
            color = "#f7b928"; // Gold
            icon = <TrophyOutlined />;
          }
          if (currentRank === 2) {
            color = "#c0c0c0"; // Silver
          }
          if (currentRank === 3) {
            color = "#cd7f32"; // Bronze
          }

          return (
            <div
              onClick={() => onUserClick && onUserClick(record.user_id)}
              style={{
                cursor: "pointer", // Рука при наведении
                width: "100%", // Чтобы кликалось по всей ширине ячейки
                height: "100%",
              }}
            >
              <span style={{ color, fontWeight: "bold", fontSize: "14px" }}>
                {icon} #{currentRank}
              </span>
            </div>
          );
        },
      },
      {
        title: "USER ID",
        dataIndex: "user_id",
        width: 120,
        render: (text) => (
          <span
            onClick={() => onUserClick && onUserClick(text)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: "AMOUNT",
        dataIndex: "amount",
        align: "right",
        render: (amount, record) => (
          <div
            style={{ ...styles.amountCell, cursor: "pointer" }}
            onClick={() => onUserClick && onUserClick(record.user_id)}
          >
            <RubyOutlined style={{ color: "#ffffffff", fontSize: "14px" }} />
            <span style={styles.amountText}>
              {Number(amount).toLocaleString()} LIT
            </span>
          </div>
        ),
      },
      {
        title: "TX HASH",
        dataIndex: "tx_hash", // или wallet_address
        align: "right",
        render: (hash) =>
          hash ? (
            <a
              href={`https://app.lighter.xyz/explorer/logs/${hash}`} // Замени на свой эксплорер
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              <LinkOutlined />
              {`${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`}
            </a>
          ) : (
            <span style={{ color: "#30363d" }}>-</span>
          ),
      },
    ],
    [currentPage, onUserClick]
  );
  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.liveIndicator}></div>
          <h3 style={styles.tableTitle}>TOP 100 WHALES</h3>
        </div>
        <div style={{ fontSize: "12px", color: "#8b949e" }}>
          Sorted by Allocation Amount
        </div>
      </div>

      <ConfigProvider theme={antdTheme}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.user_id} // Уникальный ключ
          pagination={{
            pageSize: pageSize,
            position: ["bottomCenter"],
            showSizeChanger: false,
            current: currentPage,
            onChange: (page) => {
              setCurrentPage(page);
            },
            itemRender: (current, type, originalElement) => {
              if (type === "jump-prev" || type === "jump-next") {
                return null;
              }
              return originalElement;
            },
          }}
          loading={isLoading}
          scroll={{ x: 600 }}
        />
      </ConfigProvider>
    </div>
  );
};

const antdTheme = {
  components: {
    Table: {
      colorBgContainer: "transparent",
      colorText: "#e6edf3",
      colorTextHeading: "#8b949e",
      borderColor: "rgba(48, 54, 61, 0.2)",
      headerBg: "rgba(13, 17, 23, 0.3)",
      headerSplitColor: "transparent",
      rowHoverBg: "rgba(56, 139, 253, 0.03)",
      cellPaddingBlock: 12,
    },
    Pagination: {
      colorText: "#8b949e",
      itemActiveBg: "rgba(56, 139, 253, 0.2)",
      colorPrimary: "#58a6ff",
    },
  },
};

const styles = {
  tableContainer: {
    marginTop: "40px",
    background: "rgba(22, 27, 34, 0.7)",
    borderRadius: "20px",
    border: "1px solid rgba(48, 54, 61, 0.4)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "1000px", // Ограничим ширину, чтобы не растягивалось на весь 4к монитор
  },
  tableHeader: {
    padding: "20px 30px",
    borderBottom: "1px solid rgba(48, 54, 61, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveIndicator: {
    width: "8px",
    height: "8px",
    background: "#2ea043", // Зеленый для топа
    borderRadius: "50%",
    boxShadow: "0 0 8px #2ea043",
  },
  tableTitle: {
    margin: 0,
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  link: {
    color: "#58a6ff",
    fontFamily: "'Roboto Mono', monospace",
    background: "rgba(56, 139, 253, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  amountCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
  },
  amountText: {
    color: "#e6edf3",
    fontFamily: "'Roboto Mono', monospace",
    fontWeight: "700",
    fontSize: "15px",
    textShadow: "0 0 10px rgba(46, 160, 67, 0.2)",
  },
  monoText: {
    color: "#8b949e",
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
  },
};
