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
  <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
      <div>
        <h2 className="text-2xl font-light text-gray-300">Recent Swaps</h2>
        <p className="text-sm text-gray-500 mt-1">Live trading activity across pools</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
        <div className="text-sm text-gray-400">
          Last {recentSwaps.length} swaps
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800/50">
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Pool</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Gas</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Time</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Trader</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {recentSwaps.map((swap, index) => {
            const poolInfo = getPoolInfo(swap.poolAddress);
            const swapType = getSwapType(swap);
            const amount0 = Math.abs(safeParseFloat(swap.amount0)) / Math.pow(10, 18);
            const amount1 = Math.abs(safeParseFloat(swap.amount1)) / Math.pow(10, 18);
            const gasUsed = safeParseInt(swap.gasUsed);
            const gasPrice = safeParseInt(swap.gasPrice) / 1e9;
            
            return (
              <tr key={`${swap.poolAddress}-${swap.timestamp}-${index}`} className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-1">
                      <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-300 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-gray-800">
                        {poolInfo.token0Symbol.charAt(0)}
                      </div>
                      <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-300 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-gray-800">
                        {poolInfo.token1Symbol.charAt(0)}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {poolInfo.token0Symbol}/{poolInfo.token1Symbol}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                    swapType === 'buy' 
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' 
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {swapType === 'buy' ? (
                      <>
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 2L10 6H8V10H4V6H2L6 2Z"/>
                        </svg>
                        Buy
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 10L2 6H4V2H8V6H10L6 10Z"/>
                        </svg>
                        Sell
                      </>
                    )}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-white">
                    {formatValue(Math.max(amount0, amount1))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {amount0.toFixed(4)} / {amount1.toFixed(4)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-white font-medium">
                    {(gasUsed * gasPrice / 1e9).toFixed(4)} ETH
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {gasUsed.toLocaleString()} gas
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-300">
                    {formatTime(swap.timestamp)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {swap.sender.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-gray-400">
                      {swap.sender.slice(0, 6)}...{swap.sender.slice(-4)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {recentSwaps.length === 0 && (
      <div className="text-center py-12">
        <div className="text-gray-600 text-5xl mb-4">📊</div>
        <p className="text-gray-400 text-lg">No recent swaps available</p>
        <p className="text-gray-600 text-sm mt-2">Swaps will appear here as they happen</p>
      </div>
    )}
  </div>
);
};