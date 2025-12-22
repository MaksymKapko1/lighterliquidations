import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const LiquidationDonut = ({ data }) => {
  const COLORS = [
    "#FFD700",
    "#C0C0C0",
    "#CD7F32",
    "#58a6ff",
    "#8884d8",
    "#444444",
  ];

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);

    if (sortedData.length <= 6) return sortedData;

    const top5 = sortedData.slice(0, 5);
    const others = sortedData.slice(5);

    const othersAmount = others.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return [
      ...top5,
      { symbol: "Others", amount: othersAmount, isOthers: true },
    ];
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      let rankIcon = "";
      const index = processedData.indexOf(d);

      if (d.symbol !== "Others") {
        if (index === 0) rankIcon = "🥇 ";
        else if (index === 1) rankIcon = "🥈 ";
        else if (index === 2) rankIcon = "🥉 ";
      }

      return (
        <div
          style={{
            background: "#1f1f1f",
            border: "1px solid #333",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: "#fff", fontWeight: "bold" }}>
            {rankIcon}
            {d.symbol}
          </div>
          <div style={{ color: "#ff4d4f" }}>
            ${Number(d.amount).toLocaleString("en-US", { notation: "compact" })}
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div
      style={{
        width: "100%",
        height: "220px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={4}
            dataKey="amount"
            stroke="none"
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                // Если это "Others", берем последний цвет (серый), иначе по порядку
                fill={entry.symbol === "Others" ? COLORS[5] : COLORS[index]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Легенда */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          fontSize: "11px",
          flexWrap: "wrap",
          marginTop: "-10px",
          width: "90%",
        }}
      >
        {processedData.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              color: "#8c8c8c",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background:
                  entry.symbol === "Others" ? COLORS[5] : COLORS[index],
                borderRadius: "50%",
                marginRight: 6,
              }}
            ></div>

            <span
              style={{
                fontWeight:
                  index < 3 && entry.symbol !== "Others" ? "bold" : "normal",
                color:
                  index < 3 && entry.symbol !== "Others"
                    ? "#e6edf3"
                    : "#8c8c8c",
              }}
            >
              {entry.symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LiquidationDonut;
