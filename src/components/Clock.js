import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(getFormattedTime());

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  useEffect(() => {
    const tick = () => setTime(getFormattedTime());
    tick();
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 60000);
    }, msUntilNextMinute);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return <div style={styles.clock}>{time}</div>;
};

const styles = {
  clock: {
    position: "fixed",
    top: "36px",
    right: "16px",
    fontSize: "13px",
    fontFamily: "Courier New, monospace",
    color: "#e8e8e8",
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    border: "1px solid rgba(57, 255, 20, 0.25)",
    padding: "4px 10px",
    borderRadius: "6px",
    zIndex: 100000,
    pointerEvents: "none",
    letterSpacing: "0.04em",
  },
};

export default Clock;