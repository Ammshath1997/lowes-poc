"use client";

import React, { useState } from "react";
import useWebSocket, { WebSocketMessage } from "@/hooks/useWebSocket";

export const Chat = () => {
  const { isConnected, messages, sendMessage } = useWebSocket();
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    const message: WebSocketMessage = {
      type: "chat",
      payload: input,
    };
    sendMessage(message);
    setInput("");
  };

  return (
    <div>
      <h2>
        WebSocket Connection: {isConnected ? "Connected" : "Disconnected"}
      </h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send
      </button>

      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{`${msg.type}: ${msg.payload}`}</li>
        ))}
      </ul>
    </div>
  );
};
