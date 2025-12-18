import { useEffect, useRef, useState, useCallback } from "react";

export const useSocketConnection = (url, onMessage, onOpen) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [status, setStatus] = useState("Disconnected");
  //   глянуть че это

  useEffect(() => {
    const connect = () => {
      setStatus("Connecting...");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("Connected");
        if (onOpen) onOpen(ws);
      };

      ws.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      ws.onclose = () => {
        setStatus("Disconnected");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    };
    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
  }, [url]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);
  return { status, send, wsRef };
};
