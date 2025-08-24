import React from 'react';
import { DashboardData, SwapData } from '@/utils/interfaces';
import { safeParseFloat, safeParseInt, getTokenSymbol } from '@/utils/dashboardUtils';

interface RecentSwapsProps {
  data: DashboardData;
  limit?: number;
}

export const RecentSwaps: React.FC<RecentSwapsProps> = ({ data, limit = 20 }) => {
  const formatValue = (value: number): string => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getPoolInfo = (poolAddress: string) => {
    const pool = data.pools.find(p => p.address.toLowerCase() === poolAddress.toLowerCase());
    if (!pool) return { token0Symbol: 'Unknown', token1Symbol: 'Unknown' };
    
    return {
      token0Symbol: getTokenSymbol(pool.token0.id),
      token1Symbol: getTokenSymbol(pool.token1.id)
    };
  };

  const getSwapType = (swap: SwapData): 'buy' | 'sell' => {
    return safeParseFloat(swap.amount0) > 0 ? 'sell' : 'buy';
  };

  const recentSwaps = data.allSwaps
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Swaps</h2>
        <div className="text-sm text-gray-500">
          Last {recentSwaps.length} swaps
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Pool</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Gas</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Time</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Trader</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentSwaps.map((swap, index) => {
              const poolInfo = getPoolInfo(swap.poolAddress);
              const swapType = getSwapType(swap);
              const amount0 = Math.abs(safeParseFloat(swap.amount0)) / Math.pow(10, 18);
              const amount1 = Math.abs(safeParseFloat(swap.amount1)) / Math.pow(10, 18);
              const gasUsed = safeParseInt(swap.gasUsed);
              const gasPrice = safeParseInt(swap.gasPrice) / 1e9;
              
              return (
                <tr key={`${swap.poolAddress}-${swap.timestamp}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {poolInfo.token0Symbol.charAt(0)}
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {poolInfo.token1Symbol.charAt(0)}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {poolInfo.token0Symbol}/{poolInfo.token1Symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      swapType === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {swapType === 'buy' ? '↗ Buy' : '↘ Sell'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatValue(Math.max(amount0, amount1))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {amount0.toFixed(4)} / {amount1.toFixed(4)}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm text-gray-900">
                      {(gasUsed * gasPrice / 1e9).toFixed(4)} ETH
                    </div>
                    <div className="text-xs text-gray-500">
                      {gasUsed.toLocaleString()} gas
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm text-gray-600">
                      {formatTime(swap.timestamp)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-mono text-gray-600">
                      {swap.sender.slice(0, 6)}...{swap.sender.slice(-4)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {recentSwaps.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500">No recent swaps available</p>
        </div>
      )}
    </div>
  );
};