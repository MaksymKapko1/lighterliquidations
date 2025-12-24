import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, AreaSeries } from "lightweight-charts";
import { ClockCircleOutlined } from "@ant-design/icons";

export const LiquidationChart = ({ data, onRequestUpdate }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [timeFrame, setTimeFrame] = useState(24);

  useEffect(() => {
    if (onRequestUpdate) {
      onRequestUpdate(timeFrame);
    }
  }, [timeFrame]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6b7280",
        fontFamily: "'Roboto Mono', monospace",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250, // Высота графика
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    });
    const newSeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(56, 139, 253, 0.4)",
      bottomColor: "rgba(56, 139, 253, 0.0)",
      lineColor: "#388bfd",
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = newSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);
  const options = [
    { label: "1H", value: 1 },
    { label: "4H", value: 4 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
    { label: "3D", value: 72 },
    { label: "7D", value: 168 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            color: "#e6edf3",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ClockCircleOutlined style={{ color: "#388bfd" }} />
          Liquidation Trend $USD
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeFrame(opt.value)}
              style={{
                background:
                  timeFrame === opt.value
                    ? "rgba(56, 139, 253, 0.2)"
                    : "transparent",
                border:
                  timeFrame === opt.value
                    ? "1px solid rgba(56, 139, 253, 0.4)"
                    : "1px solid transparent",
                color: timeFrame === opt.value ? "#58a6ff" : "#8b949e",
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        style={{ flex: 1, width: "100%", minHeight: "200px" }}
      />
    </div>
  );
};
