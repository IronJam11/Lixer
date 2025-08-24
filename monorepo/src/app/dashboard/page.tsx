'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header}from './components/header';
import { TimeRangeSelection } from './components/timepageSelection';
import { safeParseFloat, safeParseInt, getTokenSymbol, getTimeRangeParams } from '@/utils/dashboardUtils';
import { KeyMetrics } from './components/keyMetreics';
import { EnhancedChartsGrid } from './components/enhancedChartsGrid';
import { PoolDistributionCharts } from './components/poolDistributionCharts';
import { Pool, TimeseriesResponse, SwapData, SwapResponse, GlobalStats, ChartDataPoint, PoolAnalytics, DashboardData } from '@/utils/interfaces';
import { TimeRange, COLORS } from '@/utils/constants';
import { EnhancedPoolAnalyticsTable } from './components/enhancedPoolAnalyticsTable';
import { dashboardApi as api } from '@/api/dashboard';
import { RecentSwaps } from './components/recentSwaps';
import { PoolsOverview } from './components/poolsOverwiew';
import { PoolActivity } from './components/poolActivityComponent';

const DeFiAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    pools: [],
    timeseries: [],
    globalStats: {
      totalValueLocked: 0,
      totalVolume: 0,
      totalFees: 0,
      totalSwaps: 0,
      totalPools: 0,
      avgPoolSize: 0,
      totalToken0Volume: 0,
      totalToken1Volume: 0,
      avgGasUsed: 0,
      avgGasPrice: 0,
      uniqueUsers: 0,
      totalGasSpent: 0
    },
    poolAnalytics: [],
    allSwaps: []
  });
  
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);


  const calculateSwapAnalytics = (swaps: SwapData[]) => {
    const uniqueUsers = new Set(swaps.map(swap => swap.sender)).size;
    const totalGasUsed = swaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0);
    const totalGasPrice = swaps.reduce((sum, swap) => sum + safeParseInt(swap.gasPrice), 0);
    const avgGasUsed = swaps.length > 0 ? totalGasUsed / swaps.length : 0;
    const avgGasPrice = swaps.length > 0 ? totalGasPrice / swaps.length : 0;
    const totalGasSpent = swaps.reduce((sum, swap) => 
      sum + (safeParseInt(swap.gasUsed) * safeParseInt(swap.gasPrice) / 1e9), 0); 

    return {
      uniqueUsers,
      avgGasUsed,
      avgGasPrice,
      totalGasSpent
    };
  };

  const calculateGlobalStats = (pools: Pool[], swaps: SwapData[]): GlobalStats => {
    let totalVolume = 0;
    let totalSwaps = 0;
    let totalLiquidity = 0;
    let totalToken0Volume = 0;
    let totalToken1Volume = 0;
    
    pools.forEach(pool => {
      const vol0 = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
      const vol1 = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
      const liquidity = safeParseFloat(pool.liquidity) / Math.pow(10, 18);
      
      totalToken0Volume += vol0;
      totalToken1Volume += vol1;
      totalVolume += vol0 + vol1;
      totalSwaps += safeParseInt(pool.swapCount);
      totalLiquidity += liquidity;
    });

    const swapAnalytics = calculateSwapAnalytics(swaps);

    return {
      totalValueLocked: totalLiquidity,
      totalVolume,
      totalToken0Volume,
      totalToken1Volume,
      totalFees: totalVolume * 0.003,
      totalSwaps,
      totalPools: pools.length,
      avgPoolSize: pools.length > 0 ? totalLiquidity / pools.length : 0,
      ...swapAnalytics
    };
  };

  const processPoolAnalytics = (pools: Pool[], allSwaps: SwapData[]): PoolAnalytics[] => {
    return pools.map(pool => {
      const token0Symbol = getTokenSymbol(pool.token0.id);
      const token1Symbol = getTokenSymbol(pool.token1.id);
      const token0Volume = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
      const token1Volume = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
      const volume24h = token0Volume + token1Volume;
      const liquidity = safeParseFloat(pool.liquidity) / Math.pow(10, 18);
      const swapCount = safeParseInt(pool.swapCount);
      const fee = safeParseFloat(pool.fee) / 10000;
      
      const poolSwaps = allSwaps.filter(swap => 
        swap.poolAddress.toLowerCase() === pool.address.toLowerCase()
      );
      
      const uniqueTraders = new Set(poolSwaps.map(swap => swap.sender)).size;
      const avgGasUsed = poolSwaps.length > 0 
        ? poolSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0) / poolSwaps.length 
        : 0;
      
      return {
        address: pool.address,
        token0Symbol,
        token1Symbol,
        pairName: `${token0Symbol}/${token1Symbol}`,
        volume24h,
        token0Volume,
        token1Volume,
        tvl: liquidity,
        fees24h: volume24h * fee,
        swapCount,
        liquidity,
        fee: fee,
        volumeRatio: token1Volume > 0 ? token0Volume / token1Volume : 0,
        liquidityUtilization: liquidity > 0 ? volume24h / liquidity : 0,
        avgSwapSize: swapCount > 0 ? volume24h / swapCount : 0,
        createdAt: safeParseInt(pool.createdAtTimestamp),
        tick: safeParseInt(pool.tick),
        sqrtPrice: safeParseFloat(pool.sqrtPrice),
        recentSwaps: poolSwaps.slice(0, 5), 
        avgGasUsed,
        uniqueTraders
      };
    }).sort((a, b) => b.volume24h - a.volume24h);
  };

  const processTimeseriesData = (timeseriesResponse: TimeseriesResponse, pools: Pool[], swaps: SwapData[]): ChartDataPoint[] => {
    return timeseriesResponse.data.map(item => {
      const volume = safeParseFloat(item.volume) / 1e18; 
      const timeSwaps = swaps.filter(swap => 
        Math.abs(swap.timestamp - item.time) < 3600 
      );
      
      const gasUsed = timeSwaps.length > 0 
        ? timeSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0) / timeSwaps.length
        : 0;
      
      const gasPrice = timeSwaps.length > 0
        ? timeSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasPrice), 0) / timeSwaps.length / 1e9 
        : 0;

      return {
        time: item.time,
        volume,
        swaps: timeSwaps.length,
        fees: volume * 0.003, 
        tvl: pools.reduce((sum, pool) => sum + safeParseFloat(pool.liquidity) / 1e18, 0),
        token0Volume: volume * 0.5, 
        token1Volume: volume * 0.5,
        avgSwapSize: timeSwaps.length > 0 ? volume / timeSwaps.length : 0,
        poolCount: pools.length,
        gasUsed,
        gasPrice
      };
    });
  };

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      const { interval, limit } = getTimeRangeParams(timeRange);
      
      const [poolsRes, timeseriesRes, swapsRes] = await Promise.allSettled([
        api.getPools(),
        api.getTimeseries(interval, limit),
        api.getSwaps(undefined, 500) 
      ]);
      
      const pools: Pool[] = poolsRes.status === 'fulfilled' ? poolsRes.value.data : [];
      const timeseriesData: TimeseriesResponse = timeseriesRes.status === 'fulfilled' 
        ? timeseriesRes.value.data 
        : { interval: 'hour', data: [] };
      const allSwaps: SwapData[] = swapsRes.status === 'fulfilled' ? swapsRes.value.data.data : [];
      
      const timeseries = processTimeseriesData(timeseriesData, pools, allSwaps);
      const globalStats = calculateGlobalStats(pools, allSwaps);
      const poolAnalytics = processPoolAnalytics(pools, allSwaps);

      setData({
        pools,
        timeseries,
        globalStats,
        poolAnalytics,
        allSwaps
      });

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = (): void => {
    setRefreshing(true);
    fetchData();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header handleRefresh={handleRefresh} refreshing={refreshing} data={data} />
        {/* Time Range Selection */}
        <TimeRangeSelection setTimeRange={setTimeRange} timeRange={timeRange} />
        {/* Enhanced Key Metrics */}
        <KeyMetrics data={data} />
        {/* Enhanced Charts Grid */}
        <EnhancedChartsGrid data={data} />
        {/* Pool Distribution Charts */}
        <PoolDistributionCharts data={data} />
        {/* Enhanced Pool Analytics Table */}
        {/* <EnhancedPoolAnalyticsTable data={data} /> */}
        {/* Recent Swaps */}
        <RecentSwaps data={data} />
        {/* Pools Overview */}
        <PoolsOverview data={data} />
        {/* Pool Activity Component */}
        <PoolActivity data={data} />



      </div>
    </div>
  );
};

export default DeFiAnalyticsDashboard;