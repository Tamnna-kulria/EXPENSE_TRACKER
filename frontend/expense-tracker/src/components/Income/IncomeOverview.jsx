import React from "react";
import CustomBarChart from "../charts/CustomBarChart"

const IncomeOverview = ({ transactions, onAddIncome }) => {
  // Convert transactions to chart-friendly data
  const chartData = transactions.map((item) => ({
    month: new Date(item.date).toLocaleString("default", { month: "short" }),
    amount: item.amount,
    category: item.source,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Income Overview</h2>
        <button
          onClick={onAddIncome}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add Income
        </button>
      </div>

      {transactions.length ? (
        <CustomBarChart data={chartData} />
      ) : (
        <p className="text-gray-500">⚠️ No transactions to display on chart</p>
      )}
    </div>
  );
};

export default IncomeOverview;
