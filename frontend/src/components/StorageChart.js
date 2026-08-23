import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Node 1", value: 12.4 },
  { name: "Node 2", value: 11.8 },
  { name: "Node 3", value: 9.7 },
  { name: "Node 4", value: 7.6 },
  { name: "Node 5", value: 7.1 },
];

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#06b6d4"];

const StorageChart = () => {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
      }}
    >
      <h3>Storage Distribution</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: "10px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ fontSize: "14px" }}>
            ● {d.name} - {d.value} GB
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorageChart;