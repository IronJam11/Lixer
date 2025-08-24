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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Pools</h2>
        <div className="text-sm text-gray-500">
          Showing top {sortedPools.length} pools
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">#</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Pool</th>
              <SortButton column="volume">Volume (24h)</SortButton>
              <SortButton column="tvl">TVL</SortButton>
              <SortButton column="swaps">Swaps</SortButton>
              <SortButton column="fees">Fees (24h)</SortButton>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Fee Tier</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Utilization</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPools.map((pool, index) => (
              <tr key={pool.address} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {pool.token0Symbol.charAt(0)}
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {pool.token1Symbol.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {pool.pairName}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm font-medium text-gray-900">
                    {formatValue(pool.volume24h)}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm font-medium text-gray-900">
                    {formatValue(pool.tvl)}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-gray-900">
                    {pool.swapCount.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-sm text-green-600 font-medium">
                    {formatValue(pool.fees24h)}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {formatPercentage(pool.fee)}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          pool.utilization > 0.5 ? 'bg-green-500' : 
                          pool.utilization > 0.2 ? 'bg-yellow-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.min(pool.utilization * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 min-w-[3rem]">
                      {(pool.utilization * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <button
                    onClick={() => handleViewMore(pool.address)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedPools.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🏊‍♂️</div>
          <p className="text-gray-500">No pools data available</p>
        </div>
      )}
    </div>
  );
};