import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useReducer,
  act,
} from "react";
import { useSocketConnection } from "./useSocketConnection";

const initialState = {
  isLoading: true,

  periodRekt: {
    total: 0,
    longs: 0,
    shorts: 0,
  },
  connectionStatus: "Disconnected",
  isReady: false,
  liquidations: {
    BTC: [],
    ETH: [],
    HYPE: [],
    SUI: [],
    BNB: [],
    SOL: [],
    AAPL: [],
    GOOGL: [],
    META: [],
  },
  lastStats: { vol: 0, max: 0 },
  maxLiqs: {},
  openInterest: {},
  globalStats: {
    totalUsers: 0,
    totalNetworkOi: 0,
    totalVolume: 0,
    newUsers: 0,
    revenue: 0,
    totalDbRekt: 0,
    topGainers: [],
    topLosers: [],
  },
};

function liquidationReducer(state, action) {
  switch (action.type) {
    case "CONNECTING":
      return { ...state, connectionStatus: "Connecting..." };
    case "CONNECTED":
      return { ...state, connectionStatus: "Connected", isReady: true };
    case "DISCONNECTED":
      return { ...state, connectionStatus: "Disconnected", isReady: false };
    case "liquidations": {
      const incomingData = Array.isArray(action.data)
        ? action.data
        : [action.data];
      const nextLiqs = { ...state.liquidations };
      incomingData.forEach((item) => {
        const coinKey = item.coin || "Unknown";
        const currentList = nextLiqs[coinKey] || [];
        nextLiqs[coinKey] = [item, ...currentList].slice(0, 50);
      });
      return { ...state, liquidations: nextLiqs };
    }
    case "stats_update":
      return { ...state, lastStats: action.data };
    case "oi_update_batch":
      return { ...state, openInterest: action.data };
    case "global_stats":
      return {
        ...state,
        globalStats: { ...state.globalStats, ...action.data },
      };
    case "global_period_update":
      return { ...state, periodRekt: action.stats };
    case "max_liq_per_coin":
      return { ...state, maxLiqs: action.data };
    default:
      return state;
  }
}

export const useLiquidations = (selectedPeriod) => {
  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8765";

  const [state, dispatch] = useReducer(liquidationReducer, initialState);
  const activePeriodRef = useRef(selectedPeriod);

  useEffect(() => {
    activePeriodRef.current = selectedPeriod;
  }, [selectedPeriod]);

  const handleOpen = useCallback((ws) => {
    dispatch({ type: "CONNECTED" });
    ws.send(
      JSON.stringify({
        type: "get_global_rekt_by_hours",
        hours: activePeriodRef.current || 24,
      })
    );
  }, []);

  const handleMessage = useCallback((event) => {
    try {
      const response = JSON.parse(event.data);

      if (response.type === "global_period_update") {
        const serverHours =
          response.hours !== undefined ? Number(response.hours) : 24;
        const myHours =
          activePeriodRef.current !== undefined
            ? Number(activePeriodRef.current)
            : 24;
        if (serverHours !== myHours) return;
      }

      dispatch({
        type: response.type,
        data: response.data,
        value: response.value,
        stats: response.stats,
        hours: response.hours,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const { send, status } = useSocketConnection(
    WS_URL,
    handleMessage,
    handleOpen
  );

  useEffect(() => {
    if (status.includes("Disconnected")) dispatch({ type: "DISCONNECTED" });
  }, [status]);

  const requestGlobalPeriod = useCallback(
    (hours) => {
      activePeriodRef.current = hours;
      send({ type: "get_global_rekt_by_hours", hours });
    },
    [send]
  );

  return {
    ...state,
    ...state.globalStats,
    connectionStatus: status,
    requestGlobalPeriod,
    sendRequest: send,
  };
};
