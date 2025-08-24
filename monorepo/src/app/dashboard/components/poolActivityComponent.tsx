import React, { useState } from 'react';
import { DashboardData, SwapData, Pool } from '@/utils/interfaces';
import { safeParseFloat, safeParseInt, getTokenSymbol } from '@/utils/dashboardUtils';

interface PoolActivityProps {
  data: DashboardData;
  poolAddress?: string;
  limit?: number;
}

export const PoolActivity: React.FC<PoolActivityProps> = ({ 
  data, 
  poolAddress, 
  limit = 15 
}) => {
  const [selectedPool, setSelectedPool] = useState<string>(
    poolAddress || (data.pools.length > 0 ? data.pools[0].address : '')
  );

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

  const getPoolInfo = (poolAddr: string): Pool | null => {
    return data.pools.find(p => p.address.toLowerCase() === poolAddr.toLowerCase()) || null;
  };

  const getSwapType = (swap: SwapData): 'buy' | 'sell' => {
    return safeParseFloat(swap.amount0) > 0 ? 'sell' : 'buy';
  };

  const selectedPoolData = getPoolInfo(selectedPool);
  const poolSwaps = data.allSwaps
    .filter(swap => swap.poolAddress.toLowerCase() === selectedPool.toLowerCase())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);

  const poolStats = selectedPoolData ? {
    token0Symbol: getTokenSymbol(selectedPoolData.token0.id),
    token1Symbol: getTokenSymbol(selectedPoolData.token1.id),
    volume24h: (safeParseFloat(selectedPoolData.volumeToken0) / Math.pow(10, safeParseInt(selectedPoolData.token0.decimals))) +
               (safeParseFloat(selectedPoolData.volumeToken1) / Math.pow(10, safeParseInt(selectedPoolData.token1.decimals))),
    tvl: safeParseFloat(selectedPoolData.liquidity) / Math.pow(10, 18),
    swapCount: safeParseInt(selectedPoolData.swapCount),
    recentSwapCount: poolSwaps.length
  } : null;

  const topPools = data.pools
    .map(pool => {
      const token0Volume = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
      const token1Volume = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
      const totalVolume = token0Volume + token1Volume;
      
      return {
        ...pool,
        totalVolume,
        token0Symbol: getTokenSymbol(pool.token0.id),
        token1Symbol: getTokenSymbol(pool.token1.id)
      };
    })
    .sort((a, b) => b.totalVolume - a.totalVolume)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pool Activity</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Pool:</label>
          <select
            value={selectedPool}
            onChange={(e) => setSelectedPool(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {topPools.map(pool => (
              <option key={pool.address} value={pool.address}>
                {pool.token0Symbol}/{pool.token1Symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pool Stats Summary */}
      {poolStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(poolStats.volume24h)}
            </div>
            <div className="text-sm text-gray-600">24h Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(poolStats.tvl)}
            </div>
            <div className="text-sm text-gray-600">TVL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {poolStats.swapCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Swaps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {poolStats.recentSwapCount}
            </div>
            <div className="text-sm text-gray-600">Recent Swaps</div>
          </div>
        </div>
      )}

      {/* Recent Swaps Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Token In</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Token Out</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Value</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Gas Cost</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Time</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Trader</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {poolSwaps.map((swap, index) => {
              const swapType = getSwapType(swap);
              const amount0 = Math.abs(safeParseFloat(swap.amount0)) / Math.pow(10, 18);
              const amount1 = Math.abs(safeParseFloat(swap.amount1)) / Math.pow(10, 18);
              const gasUsed = safeParseInt(swap.gasUsed);
              const gasPrice = safeParseInt(swap.gasPrice) / 1e9;
              const gasCost = (gasUsed * gasPrice) / 1e9;
              
              const tokenIn = swapType === 'buy' ? 
                { amount: amount1, symbol: poolStats?.token1Symbol || 'Token1' } :
                { amount: amount0, symbol: poolStats?.token0Symbol || 'Token0' };
              
              const tokenOut = swapType === 'buy' ? 
                { amount: amount0, symbol: poolStats?.token0Symbol || 'Token0' } :
                { amount: amount1, symbol: poolStats?.token1Symbol || 'Token1' };
              
              return (
                <tr key={`${swap.poolAddress}-${swap.timestamp}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      swapType === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {swapType === 'buy' ? '🔼 Buy' : '🔽 Sell'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {tokenIn.amount.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tokenIn.symbol}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {tokenOut.amount.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tokenOut.symbol}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatValue(Math.max(amount0, amount1))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="text-sm text-gray-900">
                      {gasCost.toFixed(4)} ETH
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
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <span className="text-sm font-mono text-gray-600">
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

      {poolSwaps.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">⚡</div>
          <p className="text-gray-500">No recent activity for this pool</p>
          <p className="text-gray-400 text-sm mt-1">
            Try selecting a different pool or check back later
          </p>
        </div>
      )}
    </div>
  );
};