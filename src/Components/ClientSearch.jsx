import React from "react";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MARKET_METADATA } from "../constants/marketMetadata";

export const CoinSearch = () => {
  const navigate = useNavigate();

  const handleSelect = (value) => {
    // Теперь value будет числовым ID (например, 1), а не тикером
    navigate(`/liquidations/${value}`);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder={
          <div
            style={{
              color: "#8b949e",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <SearchOutlined style={{ color: "#58a6ff" }} />{" "}
            <span>Search coin...</span>
          </div>
        }
        onChange={handleSelect}
        optionFilterProp="label"
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        dropdownStyle={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
        }}
        bordered={false}
        className="neon-search-select"
        suffixIcon={<span style={{ color: "#58a6ff" }}>▼</span>}
      >
        {/* Изменил деструктуризацию: key - это "BTC", data - это объект с данными */}
        {Object.entries(MARKET_METADATA).map(([key, data]) => {
          // 👇 ПРЕДПОЛАГАЕМ, что ID лежит в data.id или data.marketId
          // Если поля нет, код упадет или вернет undefined.
          // Убедись, что в marketMetadata есть поле id!
          const numericId = data.id || data.marketId;

          return (
            <Select.Option
              key={key}
              value={numericId} /* 👈 ВАЖНО: передаем числовой ID, а не ключ */
              label={data.title || key}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {data.icon && (
                  <img
                    src={data.icon}
                    style={{ width: 16, height: 16, borderRadius: "50%" }}
                    alt=""
                  />
                )}
                <span style={{ color: "#e6edf3", fontWeight: 600 }}>
                  {data.symbol || key}
                </span>
                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "12px",
                    marginLeft: "auto",
                  }}
                >
                  {data.name}
                </span>
              </div>
            </Select.Option>
          );
        })}
      </Select>

      {/* Стили без изменений */}
      <style>{`
          .neon-search-select .ant-select-selector {
            background-color: transparent !important; 
            border: 1px solid #58a6ff !important;
            border-radius: 50px !important;
            height: 42px !important;
            display: flex !important;
            align-items: center !important;
            color: white !important;
            box-shadow: 0 0 5px rgba(88, 166, 255, 0.3), inset 0 0 5px rgba(88, 166, 255, 0.1) !important;
            transition: all 0.3s ease;
          }

          .neon-search-select input {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            caret-color: #58a6ff !important;
        }
            .neon-search-select .ant-select-selection-search-input {
            color: #ffffff !important;
            opacity: 1 !important;
            font-weight: 700 !important;
        }

          .neon-search-select:hover .ant-select-selector,
          .neon-search-select.ant-select-focused .ant-select-selector {
              border-color: #58a6ff !important;
              box-shadow: 0 0 15px rgba(88, 166, 255, 0.6), inset 0 0 10px rgba(88, 166, 255, 0.2) !important;
          }

          .neon-search-select .ant-select-selection-placeholder {
              padding-left: 10px;
          }
          
          .neon-search-select .ant-select-selection-item {
              color: white !important;
              font-weight: 600;
              padding-left: 10px !important;
          }

          .ant-select-dropdown {
              border: 1px solid #58a6ff !important;
              box-shadow: 0 0 15px rgba(88, 166, 255, 0.4) !important;
          }
          .ant-select-item { color: #e6edf3 !important; }
          .ant-select-item-option-active { background-color: rgba(56, 139, 253, 0.15) !important; }
          .ant-select-item-option-selected { background-color: rgba(56, 139, 253, 0.25) !important; }
        `}</style>
    </div>
  );
};
