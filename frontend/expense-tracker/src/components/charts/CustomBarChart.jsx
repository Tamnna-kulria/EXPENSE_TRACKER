import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data = [] }) => {
  const getBarColor = (index) => (index % 2 === 0 ? "#875cf5" : "#cfbefb"); // purple shades

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.category || "Expense"}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="font-medium text-gray-900">${payload[0].payload.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 p-4 rounded-lg shadow-sm w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap="30%"
          barSize={40} fill="#875cf5"
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="month" 
            tick={{ fontSize: 12, fill: "#555" }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
            interval={0}
            padding={{ left: 10, right: 10 }} // center bars
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
