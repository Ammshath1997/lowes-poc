"use client";
import { useEffect, useRef, useState } from "react";

export type WebSocketMessage<T = any> = {
  type: string;
  payload: T;
};

type WebSocketState = {
  isConnected: boolean;
  messages: WebSocketMessage[];
  sendMessage: (message: WebSocketMessage) => void;
};

const websocketUrl: string =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:2305";

const useWebSocket = (): WebSocketState => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    // Establish WebSocket connection only once
    if (!socketRef.current) {
      const socket = new WebSocket(websocketUrl);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      socketRef.current = socket;
    }

    // Cleanup on component unmount
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  // Send message through WebSocket
  const sendMessage = (message: WebSocketMessage): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return { isConnected, messages, sendMessage };
};

export default useWebSocket;
