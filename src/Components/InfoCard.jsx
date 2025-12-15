import React from "react";
import { Card, Statistic } from "antd";

export const InfoCard = ({ title, value, prefix = "$" }) => {
  // 1. Проверяем: value — это React-элемент (например, <Spin />) или просто данные?
  const isComponent = React.isValidElement(value);

  return (
    <Card
      hoverable
      style={{
        cursor: "pointer",
        height: "100%",
        border: "1px solid #000000ff",
        borderRadius: "20px",
        textAlign: "center", // Центрируем всё содержимое
      }}
      variant="outlined"
    >
      {isComponent ? (
        // ВАРИАНТ А: Если это Спиннер — рендерим его напрямую вручную
        <div style={{ padding: "4px 0" }}>
          {/* Заголовок (стили копируем визуально из Statistic) */}
          <div
            style={{
              marginBottom: 4,
              color: "rgba(0, 0, 0, 0.45)",
              fontSize: 14,
            }}
          >
            {title}
          </div>
          {/* Сам спиннер */}
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#cf1322" }}>
            {value}
          </div>
        </div>
      ) : (
        // ВАРИАНТ Б: Если это число/строка — используем мощь Ant Design Statistic
        <Statistic
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {title}
            </div>
          }
          value={value}
          precision={0}
          styles={{
            content: { color: "#cf1322", fontWeight: "bold" },
          }}
          // Если ты передаешь строку "$ 1000", то этот prefix добавит еще один "$".
          // Если хочешь избежать двойного доллара, можно добавить проверку:
          prefix={
            typeof value === "string" && value.includes("$") ? null : prefix
          }
        />
      )}
    </Card>
  );
};
