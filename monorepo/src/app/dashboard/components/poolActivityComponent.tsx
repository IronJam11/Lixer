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
  <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
      <div>
        <h2 className="text-2xl font-light text-gray-300">Pool Activity</h2>
        <p className="text-sm text-gray-500 mt-1">Detailed transaction history by pool</p>
      </div>
      <div className="flex items-center space-x-3">
        <label className="text-sm font-medium text-gray-400">Pool:</label>
        <select
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
          className="text-sm bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        >
          {topPools.map(pool => (
            <option key={pool.address} value={pool.address} className="bg-gray-800 text-white">
              {pool.token0Symbol}/{pool.token1Symbol}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Pool Stats Summary */}
    {poolStats && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-800/50 border-b border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-light text-white mb-1">
            {formatValue(poolStats.volume24h)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">24h Volume</div>
          <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-teal-300 mt-2 rounded-full"></div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-white mb-1">
            {formatValue(poolStats.tvl)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">TVL</div>
          <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-teal-300 mt-2 rounded-full"></div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-white mb-1">
            {poolStats.swapCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Total Swaps</div>
          <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-teal-300 mt-2 rounded-full"></div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-white mb-1">
            {poolStats.recentSwapCount}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Recent Swaps</div>
          <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-teal-300 mt-2 rounded-full"></div>
        </div>
      </div>
    )}

    {/* Recent Swaps Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800/50">
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Token In</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Token Out</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Value</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Gas Cost</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Time</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Trader</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
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
              <tr key={`${swap.poolAddress}-${swap.timestamp}-${index}`} className="hover:bg-gray-800/30 transition-colors duration-200">
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                    swapType === 'buy' 
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' 
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {swapType === 'buy' ? (
                      <>
                        <svg className="w-3 h-3 mr-1.5" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 2L10 6H8V10H4V6H2L6 2Z"/>
                        </svg>
                        Buy
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1.5" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 10L2 6H4V2H8V6H10L6 10Z"/>
                        </svg>
                        Sell
                      </>
                    )}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-white">
                    {tokenIn.amount.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tokenIn.symbol}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-white">
                    {tokenOut.amount.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tokenOut.symbol}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-medium text-white">
                    {formatValue(Math.max(amount0, amount1))}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-white font-medium">
                    {gasCost.toFixed(4)} ETH
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
                    <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-teal-300 rounded-full flex items-center justify-center">
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

    {poolSwaps.length === 0 && (
      <div className="text-center py-12">
        <div className="text-gray-600 text-5xl mb-4">⚡</div>
        <p className="text-gray-400 text-lg">No recent activity for this pool</p>
        <p className="text-gray-600 text-sm mt-2">
          Try selecting a different pool or check back later
        </p>
      </div>
    )}
  </div>
);
};