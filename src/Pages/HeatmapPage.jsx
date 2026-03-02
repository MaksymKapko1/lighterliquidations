import React, { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useLiquidations } from "../hooks/useLiquidations";
import { AppHeader } from "../Components/AppHeader";
import "./HeatmapPage.css";

const HeatmapPage = () => {
  const { heatmapData } = useLiquidations();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!heatmapData || (!heatmapData.bids && !heatmapData.asks)) return;

    const now = new Date().toLocaleTimeString("en-US", { hour12: false });

    setHistory((prev) => {
      const lastTime = prev.length > 0 ? prev[prev.length - 1].time : null;
      if (lastTime === now) return prev;

      const newHistory = [...prev, { time: now, data: heatmapData }];
      if (newHistory.length > 100) newHistory.shift();
      return newHistory;
    });
  }, [heatmapData]);

  const chartOptions = useMemo(() => {
    if (history.length === 0) return {};

    const times = [];
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    history.forEach((snapshot) => {
      times.push(snapshot.time);
      const { bids = {}, asks = {} } = snapshot.data;

      const checkPriceAndVol = (orders) => {
        Object.entries(orders).forEach(([price, vol]) => {
          const p = Number(price);
          const v = Number(vol);
          if (p < minPrice) minPrice = p;
          if (p > maxPrice) maxPrice = p;
          if (v > maxVol) maxVol = v;
        });
      };

      checkPriceAndVol(bids);
      checkPriceAndVol(asks);
    });

    if (minPrice === Infinity) return {};

    const priceCategories = [];
    for (let p = minPrice; p <= maxPrice; p += 0.01) {
      priceCategories.push(p.toFixed(2));
    }

    const bidPoints = [];
    const askPoints = [];

    history.forEach((snapshot, xIndex) => {
      const { bids = {}, asks = {} } = snapshot.data;

      Object.entries(bids).forEach(([price, vol]) => {
        const yIndex = priceCategories.indexOf(Number(price).toFixed(2));
        if (yIndex !== -1) bidPoints.push([xIndex, yIndex, Number(vol)]);
      });

      Object.entries(asks).forEach(([price, vol]) => {
        const yIndex = priceCategories.indexOf(Number(price).toFixed(2));
        if (yIndex !== -1) askPoints.push([xIndex, yIndex, Number(vol)]);
      });
    });

    return {
      tooltip: {
        position: "top",
        backgroundColor: "rgba(13, 17, 23, 0.9)",
        borderColor: "#30363d",
        textStyle: { color: "#c9d1d9" },
        formatter: function (params) {
          const time = times[params.data[0]];
          const price = priceCategories[params.data[1]];
          const vol = params.data[2];
          const type =
            params.seriesName === "Bids" ? "🟢 Buy (Bid)" : "🔴 Sell (Ask)";
          return `🕒 ${time}<br/>${type}<br/>💰 $${price}<br/>📊 ${vol.toFixed(0)} LIT`;
        },
      },
      grid: { top: 20, bottom: 40, left: 60, right: 20 },
      xAxis: {
        type: "category",
        data: times,
        splitArea: { show: false },
        axisLabel: { color: "#8b949e", fontSize: 10 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#30363d" } },
      },
      yAxis: {
        type: "category",
        data: priceCategories,
        splitArea: { show: false },
        axisLabel: { color: "#8b949e", fontSize: 11 },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#30363d" } },
      },
      // ДЕЛАЕМ ДВА ГРАДИЕНТА (ДЛЯ BIDS И ASKS ОТДЕЛЬНО)
      visualMap: [
        {
          seriesIndex: 0, // Привязываем к первому графику (Bids)
          min: 0,
          max: maxVol * 0.6,
          show: false,
          inRange: {
            // Черный -> Темно-зеленый -> Изумрудный -> Ярко-салатовый
            color: ["#0d1117", "#0a2e1c", "#155d3a", "#299d63", "#00ff88"],
          },
        },
        {
          seriesIndex: 1, // Привязываем ко второму графику (Asks)
          min: 0,
          max: maxVol * 0.6,
          show: false,
          inRange: {
            // Черный -> Бордовый -> Красный -> Ярко-красный
            color: ["#0d1117", "#330a0f", "#751420", "#c22535", "#ff4444"],
          },
        },
      ],
      // РИСУЕМ ДВА СЛОЯ НА ОДНОМ ХОЛСТЕ
      series: [
        {
          name: "Bids",
          type: "heatmap",
          data: bidPoints,
          progressive: 1000,
          animation: false,
          // ДОБАВЛЯЕМ ВОТ ЭТОТ БЛОК:
          itemStyle: {
            borderColor: "#0d1117", // Цвет фона сайта (создает прозрачный зазор)
            borderWidth: 1, // Толщина черточки (можешь поставить 2, если хочешь зазоры шире)
          },
        },
        {
          name: "Asks",
          type: "heatmap",
          data: askPoints,
          progressive: 1000,
          animation: false,
          // И ВОТ ЭТОТ БЛОК:
          itemStyle: {
            borderColor: "#0d1117", // Цвет фона
            borderWidth: 1,
          },
        },
      ], //222
    };
  }, [history]);

  // ВОТ ЭТОТ БЛОК ОТВЕЧАЕТ ЗА ОТРИСОВКУ НА ЭКРАНЕ!
  return (
    <>
      <AppHeader />
      <div className="heatmap-container">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "32px",
            fontWeight: "800",
            background: "linear-gradient(90deg, #58a6ff 0%, #00ff88 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 4px 20px rgba(0, 255, 136, 0.3)",
            letterSpacing: "1px",
          }}
        >
          $LIT Token Heatmap
        </h2>

        <div
          style={{
            background: "#0d1117",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #30363d",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          {history.length > 0 ? (
            <ReactECharts
              option={chartOptions}
              style={{ height: "650px", width: "100%" }}
              theme="dark"
              notMerge={true}
            />
          ) : (
            <div
              style={{
                height: "650px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: "#8b949e",
                  fontStyle: "italic",
                  fontSize: "16px",
                }}
              >
                Waiting for heatmap data... <br />
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeatmapPage;
