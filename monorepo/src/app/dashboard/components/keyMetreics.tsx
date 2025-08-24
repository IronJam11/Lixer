import React from "react";
import { formatCurrency, formatGwei, formatNumber } from "@/utils/dashboardUtils";

export const KeyMetrics: React.FC<{ data: any }> = ({ data }) => {
  return (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
    
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-teal-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Volume</p>
      <h3 className="text-xl font-light text-white">{formatCurrency(data.globalStats.totalVolume)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-blue-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total TVL</p>
      <h3 className="text-xl font-light text-white">{formatCurrency(data.globalStats.totalValueLocked)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-purple-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Swaps</p>
      <h3 className="text-xl font-light text-white">{formatNumber(data.globalStats.totalSwaps)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-green-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Fees</p>
      <h3 className="text-xl font-light text-white">{formatCurrency(data.globalStats.totalFees)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-yellow-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Unique Users</p>
      <h3 className="text-xl font-light text-white">{formatNumber(data.globalStats.uniqueUsers)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-red-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Avg Gas Used</p>
      <h3 className="text-xl font-light text-white">{formatNumber(data.globalStats.avgGasUsed)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-orange-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Avg Gas Price</p>
      <h3 className="text-xl font-light text-white">{formatGwei(data.globalStats.avgGasPrice)}</h3>
      
    </div>

    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:border-pink-500/50 transition-all duration-300">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total Gas Spent</p>
      <h3 className="text-xl font-light text-white">{formatCurrency(data.globalStats.totalGasSpent)}</h3>
      
    </div>

  </div>
);
}