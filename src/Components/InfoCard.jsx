import React from "react";
import { Card, Statistic } from "antd";

export const InfoCard = ({ title, value, prefix = "$" }) => {
  const isComponent = React.isValidElement(value);

  return (
    <Card
      hoverable
      style={{
        cursor: "pointer",
        height: "100%",
        border: "1px solid #000000ff",
        borderRadius: "20px",
        textAlign: "center",
      }}
      variant="outlined"
    >
      {isComponent ? (
        <div style={{ padding: "4px 0" }}>
          <div
            style={{
              marginBottom: 4,
              color: "rgba(0, 0, 0, 0.45)",
              fontSize: 14,
            }}
          >
            {title}
          </div>

          <div style={{ fontSize: 24, fontWeight: "bold", color: "#cf1322" }}>
            {value}
          </div>
        </div>
      ) : (
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
          prefix={
            typeof value === "string" && value.includes("$") ? null : prefix
          }
        />
      )}
    </Card>
  );
};
