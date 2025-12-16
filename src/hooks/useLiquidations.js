import { useState, useEffect, useCallback, useRef } from "react";

export const useLiquidations = () => {
  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";
  // ДОБАВЬ ВОТ ЭТУ СТРОКУ:
  console.log("🌍 ENV CHECK: ", import.meta.env.VITE_WS_URL);
  console.log("🔗 Connecting to:", WS_URL);

  const [lastStats, setLastStats] = useState({ vol: 0, max: 0 });
  const [liquidations, setLiquidations] = useState({
    BTC: [],
    ETH: [],
    HYPE: [],
    SUI: [],
    BNB: [],
    SOL: [],
    AAPL: [],
    GOOGL: [],
    META: [],
  });

  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isReady, setIsReady] = useState(false);
  const [openInterest, setOpenInterest] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNetworkOi, setTotalNetworkOi] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [periodRekt, setPeriodRekt] = useState(0);
  const [totalDbRekt, setTotalDbRekt] = useState(0);

  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);

  const wsRef = useRef(null);

  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        setConnectionStatus("Connected 🟢");
        setIsReady(true);
        console.log("WS CONNECTED to", WS_URL);

        ws.send(JSON.stringify({ type: "init" }));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.type === "liquidations") {
            const incomingData = Array.isArray(response.data)
              ? response.data
              : [response.data];

            setLiquidations((prevState) => {
              const nextState = { ...prevState };
              incomingData.forEach((item) => {
                const coinKey = item.coin || "Unknown";
                if (!nextState[coinKey]) nextState[coinKey] = [];
                nextState[coinKey] = [item, ...nextState[coinKey]].slice(0, 50);
              });
              return nextState;
            });
          } else if (response.type === "stats_update") {
            setLastStats(response.data);
          } else if (response.type === "oi_update_batch") {
            setOpenInterest(response.data);
          } else if (response.type === "global_stats") {
            const d = response.data;
            setTotalUsers(d.totalUsers);
            setTotalNetworkOi(d.totalNetworkOi);
            setTotalVolume(d.totalVolume);
            setNewUsers(d.newUsers);
            setRevenue(d.revenue);
            setTotalDbRekt(d.totalDbRekt || 0);
            setTopGainers(d.topGainers || []);
            setTopLosers(d.topLosers || []);
          } else if (response.type === "global_period_update") {
            setPeriodRekt(response.value);
          }
        } catch (err) {
          console.error("Ошибка обработки:", err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus("Disconnected 🔴");
        setIsReady(false);
        console.log("⚠️ WS Closed. Reconnecting in 3s...");

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
  }, [WS_URL]);

  const sendRequest = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.log("Socket not ready, skip sending");
    }
  }, []);

  const requestGlobalPeriod = useCallback(
    (hours) => {
      sendRequest({
        type: "get_global_rekt_by_hours",
        hours: hours,
      });
    },
    [sendRequest]
  );

  return {
    topGainers,
    topLosers,
    periodRekt,
    requestGlobalPeriod,
    liquidations,
    connectionStatus,
    lastStats,
    sendRequest,
    isReady,
    openInterest,
    totalUsers,
    totalNetworkOi,
    totalVolume,
    newUsers,
    revenue,
    totalDbRekt,
  };
};
