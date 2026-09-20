import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/LiveStats.css";

export default function LiveStats() {
  const [uptime, setUptime] = useState(0);
  const [latency, setLatency] = useState(12);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setUptime((prev) => prev + 1), 1000);
    const pingTimer = setInterval(() => {
      setLatency(Math.floor(Math.random() * 5) + 10); // Fluctuate between 10-15ms
    }, 2000);
    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="live-stats-bar">
      <span className="stat-item highlight">● LIVE</span>
      <span className="stat-item">UPTIME: {formatUptime(uptime)}</span>
      <span className="stat-item">PING: {latency}ms</span>
      <span className="stat-item hidden-mobile">ALLOC: {(12.4 + latency * 0.01).toFixed(2)}MB</span>
      <span className="stat-item">ROUTE: {location.pathname.toUpperCase() || "/HOME"}</span>
    </div>
  );
}