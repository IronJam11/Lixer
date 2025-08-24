import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardData, Pool } from '@/utils/interfaces';
import { safeParseFloat, safeParseInt, getTokenSymbol } from '@/utils/dashboardUtils';
import { ExternalLink } from 'lucide-react';

interface PoolsOverviewProps {
  data: DashboardData;
  limit?: number;
}

export const PoolsOverview: React.FC<PoolsOverviewProps> = ({ data, limit = 10 }) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'volume' | 'tvl' | 'swaps' | 'fees'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatValue = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleViewMore = (poolAddress: string) => {
    router.push(`/pools/${poolAddress}`);
  };

  const getPoolAnalytics = (pool: Pool) => {
    const token0Symbol = getTokenSymbol(pool.token0.id);
    const token1Symbol = getTokenSymbol(pool.token1.id);
    const token0Volume = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
    const token1Volume = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
    const volume24h = token0Volume + token1Volume;
    const tvl = safeParseFloat(pool.liquidity) / Math.pow(10, 18);
    const swapCount = safeParseInt(pool.swapCount);
    const fee = safeParseFloat(pool.fee) / 10000;
    const fees24h = volume24h * fee;

    return {
      address: pool.address,
      token0Symbol,
      token1Symbol,
      pairName: `${token0Symbol}/${token1Symbol}`,
      volume24h,
      tvl,
      swapCount,
      fees24h,
      fee,
      utilization: tvl > 0 ? volume24h / tvl : 0
    };
  };

  const sortPools = (pools: ReturnType<typeof getPoolAnalytics>[]) => {
    return [...pools].sort((a, b) => {
      let valueA: number, valueB: number;
      
      switch (sortBy) {
        case 'volume':
          valueA = a.volume24h;
          valueB = b.volume24h;
          break;
        case 'tvl':
          valueA = a.tvl;
          valueB = b.tvl;
          break;
        case 'swaps':
          valueA = a.swapCount;
          valueB = b.swapCount;
          break;
        case 'fees':
          valueA = a.fees24h;
          valueB = b.fees24h;
          break;
        default:
          valueA = a.volume24h;
          valueB = b.volume24h;
      }
      
      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const poolsAnalytics = data.pools.map(getPoolAnalytics);
  const sortedPools = sortPools(poolsAnalytics).slice(0, limit);

  const SortButton: React.FC<{ column: typeof sortBy; children: React.ReactNode }> = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className={`text-left py-3 px-2 text-sm font-semibold transition-colors hover:text-blue-600 ${
        sortBy === column ? 'text-blue-600' : 'text-gray-600'
      }`}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortBy === column && (
          <span className="text-xs">
            {sortOrder === 'desc' ? '↓' : '↑'}
          </span>
        )}
      </div>
    </button>
  );

  return (
  <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
      <div>
        <h2 className="text-2xl font-light text-gray-300">Top Pools</h2>
        <p className="text-sm text-gray-500 mt-1">Most active liquidity pools</p>
      </div>
      <div className="text-sm text-gray-400">
        Showing top {sortedPools.length} pools
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800/50">
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">#</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Pool</th>
            <SortButton column="volume">Volume (24h)</SortButton>
            <SortButton column="tvl">TVL</SortButton>
            <SortButton column="swaps">Swaps</SortButton>
            <SortButton column="fees">Fees (24h)</SortButton>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Fee Tier</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Utilization</th>
            <th className="text-center py-4 px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {sortedPools.map((pool, index) => (
            <tr key={pool.address} className="hover:bg-gray-800/30 transition-colors duration-200">
              <td className="py-5 px-4">
                <span className="text-sm font-medium text-gray-400">
                  {index + 1}
                </span>
              </td>
              <td className="py-5 px-4">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-1">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-gray-800">
                      {pool.token0Symbol.charAt(0)}
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-300 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-gray-800">
                      {pool.token1Symbol.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {pool.pairName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="text-sm font-medium text-white">
                  {formatValue(pool.volume24h)}
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="text-sm font-medium text-white">
                  {formatValue(pool.tvl)}
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="text-sm text-gray-300">
                  {pool.swapCount.toLocaleString()}
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="text-sm text-teal-400 font-medium">
                  {formatValue(pool.fees24h)}
                </div>
              </td>
              <td className="py-5 px-4 text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600">
                  {formatPercentage(pool.fee)}
                </span>
              </td>
              <td className="py-5 px-4 text-right">
                <div className="flex items-center justify-end space-x-3">
                  <div className="w-20 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        pool.utilization > 0.5 ? 'bg-gradient-to-r from-teal-400 to-teal-600' : 
                        pool.utilization > 0.2 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${Math.min(pool.utilization * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 min-w-[3rem] font-medium">
                    {(pool.utilization * 100).toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="py-5 px-4 text-center">
                <button
                  onClick={() => handleViewMore(pool.address)}
                  className="inline-flex items-center px-4 py-2 text-xs font-medium text-teal-300 bg-gray-800 border border-teal-500/30 rounded-lg hover:bg-teal-500/10 hover:border-teal-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-1 focus:ring-offset-gray-900"
                >
                  <ExternalLink className="w-3 h-3 mr-1.5" />
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {sortedPools.length === 0 && (
      <div className="text-center py-12">
        <div className="text-gray-600 text-5xl mb-4">🏊‍♂️</div>
        <p className="text-gray-400 text-lg">No pools data available</p>
        <p className="text-gray-600 text-sm mt-2">Check back later for updated pool information</p>
      </div>
    )}
  </div>
);
};