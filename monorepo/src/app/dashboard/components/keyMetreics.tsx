import React from "react";
import { formatCurrency, formatGwei, formatNumber } from "@/utils/dashboardUtils";

export const KeyMetrics: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Total Volume</p>
            <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalVolume)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Total TVL</p>
            <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalValueLocked)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Total Swaps</p>
            <h3 className="text-lg font-bold">{formatNumber(data.globalStats.totalSwaps)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Total Fees</p>
            <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalFees)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Unique Users</p>
            <h3 className="text-lg font-bold">{formatNumber(data.globalStats.uniqueUsers)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Avg Gas Used</p>
            <h3 className="text-lg font-bold">{formatNumber(data.globalStats.avgGasUsed)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Avg Gas Price</p>
            <h3 className="text-lg font-bold">{formatGwei(data.globalStats.avgGasPrice)}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-xs text-gray-600">Total Gas Spent</p>
            <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalGasSpent)}</h3>
          </div>
        </div>
  );
}