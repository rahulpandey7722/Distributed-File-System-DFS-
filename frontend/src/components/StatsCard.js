import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        flex: 1,
        margin: "10px",
      }}
    >
      <h4 style={{ color: "#94a3b8" }}>{title}</h4>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
};

export default StatsCard;