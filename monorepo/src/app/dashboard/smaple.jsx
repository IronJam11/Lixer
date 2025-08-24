// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import axios, { AxiosResponse } from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart } from 'recharts';
// import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Timer, ArrowUpDown, Users, Volume2, Calendar, RefreshCw, Zap } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:3000';

// interface TokenInfo {
//   id: string;
//   decimals: string;
// }

// interface Factory {
//   id: string;
// }

// interface Pool {
//   id: string;
//   address: string;
//   factory: Factory;
//   token0: TokenInfo;
//   token1: TokenInfo;
//   fee: string;
//   tickSpacing: string;
//   liquidity: string;
//   sqrtPrice: string;
//   tick: string;
//   volumeToken0: string;
//   volumeToken1: string;
//   swapCount: string;
//   createdAtTimestamp: string;
//   createdAtBlockNumber: string;
//   metadata: any;
// }

// interface TimeseriesResponse {
//   interval: string;
//   data: {
//     time: number;
//     volume: string;
//   }[];
// }

// interface SwapData {
//   id: string;
//   txHash: string;
//   poolAddress: string;
//   sender: string;
//   recipient: string;
//   amount0: string;
//   amount1: string;
//   sqrtPriceX96: string;
//   liquidity: string;
//   tick: number;
//   timestamp: number;
//   blockNumber: number;
//   gasUsed: string;
//   gasPrice: string;
// }

// interface SwapResponse {
//   data: SwapData[];
// }

// interface GlobalStats {
//   totalValueLocked: number;
//   totalVolume: number;
//   totalFees: number;
//   totalSwaps: number;
//   totalPools: number;
//   avgPoolSize: number;
//   totalToken0Volume: number;
//   totalToken1Volume: number;
//   avgGasUsed: number;
//   avgGasPrice: number;
//   uniqueUsers: number;
//   totalGasSpent: number;
// }

// interface ChartDataPoint {
//   time: number;
//   volume: number;
//   swaps: number;
//   fees: number;
//   tvl: number;
//   token0Volume: number;
//   token1Volume: number;
//   avgSwapSize: number;
//   poolCount: number;
//   gasUsed?: number;
//   gasPrice?: number;
// }

// interface PoolAnalytics {
//   address: string;
//   token0Symbol: string;
//   token1Symbol: string;
//   pairName: string;
//   volume24h: number;
//   tvl: number;
//   fees24h: number;
//   swapCount: number;
//   liquidity: number;
//   fee: number;
//   volumeRatio: number;
//   liquidityUtilization: number;
//   avgSwapSize: number;
//   createdAt: number;
//   tick: number;
//   sqrtPrice: number;
//   token0Volume: number;
//   token1Volume: number;
//   recentSwaps?: SwapData[];
//   avgGasUsed?: number;
//   uniqueTraders?: number;
// }

// interface DashboardData {
//   pools: Pool[];
//   timeseries: ChartDataPoint[];
//   globalStats: GlobalStats;
//   poolAnalytics: PoolAnalytics[];
//   allSwaps: SwapData[];
// }

// type TimeRange = '1h' | '24h' | '7d' | '30d';

// const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2', '#be123c', '#4338ca'];

// const api = {
//   getPools: (): Promise<AxiosResponse<Pool[]>> => 
//     axios.get(`${API_BASE_URL}/pools`),
  
//   getTimeseries: (interval: string = 'hour', limit: number = 24): Promise<AxiosResponse<TimeseriesResponse>> => 
//     axios.get(`${API_BASE_URL}/timeseries/volume?interval=${interval}&limit=${limit}`),

//   getSwaps: (poolAddress?: string, limit: number = 100): Promise<AxiosResponse<SwapResponse>> => {
//     const url = poolAddress 
//       ? `${API_BASE_URL}/swaps?pool=${poolAddress}&limit=${limit}`
//       : `${API_BASE_URL}/swaps?limit=${limit}`;
//     return axios.get(url);
//   },
// };

// const DeFiAnalyticsDashboard: React.FC = () => {
//   const [data, setData] = useState<DashboardData>({
//     pools: [],
//     timeseries: [],
//     globalStats: {
//       totalValueLocked: 0,
//       totalVolume: 0,
//       totalFees: 0,
//       totalSwaps: 0,
//       totalPools: 0,
//       avgPoolSize: 0,
//       totalToken0Volume: 0,
//       totalToken1Volume: 0,
//       avgGasUsed: 0,
//       avgGasPrice: 0,
//       uniqueUsers: 0,
//       totalGasSpent: 0
//     },
//     poolAnalytics: [],
//     allSwaps: []
//   });
  
//   const [timeRange, setTimeRange] = useState<TimeRange>('24h');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   const getTokenSymbol = (tokenId: string): string => {
//     return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
//   };

//   const safeParseFloat = (value: string | number | undefined): number => {
//     if (value === undefined || value === null) return 0;
//     const parsed = typeof value === 'string' ? parseFloat(value) : value;
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const safeParseInt = (value: string | number | undefined): number => {
//     if (value === undefined || value === null) return 0;
//     const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const getTimeRangeParams = (timeRange: TimeRange) => {
//     switch (timeRange) {
//       case '1h':
//         return { interval: 'minute', limit: 60 };
//       case '24h':
//         return { interval: 'hour', limit: 24 };
//       case '7d':
//         return { interval: 'hour', limit: 168 }; // 24 * 7
//       case '30d':
//         return { interval: 'day', limit: 30 };
//       default:
//         return { interval: 'hour', limit: 24 };
//     }
//   };

//   const calculateSwapAnalytics = (swaps: SwapData[]) => {
//     const uniqueUsers = new Set(swaps.map(swap => swap.sender)).size;
//     const totalGasUsed = swaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0);
//     const totalGasPrice = swaps.reduce((sum, swap) => sum + safeParseInt(swap.gasPrice), 0);
//     const avgGasUsed = swaps.length > 0 ? totalGasUsed / swaps.length : 0;
//     const avgGasPrice = swaps.length > 0 ? totalGasPrice / swaps.length : 0;
//     const totalGasSpent = swaps.reduce((sum, swap) => 
//       sum + (safeParseInt(swap.gasUsed) * safeParseInt(swap.gasPrice) / 1e9), 0); // Convert to Gwei

//     return {
//       uniqueUsers,
//       avgGasUsed,
//       avgGasPrice,
//       totalGasSpent
//     };
//   };

//   const calculateGlobalStats = (pools: Pool[], swaps: SwapData[]): GlobalStats => {
//     let totalVolume = 0;
//     let totalSwaps = 0;
//     let totalLiquidity = 0;
//     let totalToken0Volume = 0;
//     let totalToken1Volume = 0;
    
//     pools.forEach(pool => {
//       const vol0 = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
//       const vol1 = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
//       const liquidity = safeParseFloat(pool.liquidity) / Math.pow(10, 18);
      
//       totalToken0Volume += vol0;
//       totalToken1Volume += vol1;
//       totalVolume += vol0 + vol1;
//       totalSwaps += safeParseInt(pool.swapCount);
//       totalLiquidity += liquidity;
//     });

//     const swapAnalytics = calculateSwapAnalytics(swaps);

//     return {
//       totalValueLocked: totalLiquidity,
//       totalVolume,
//       totalToken0Volume,
//       totalToken1Volume,
//       totalFees: totalVolume * 0.003,
//       totalSwaps,
//       totalPools: pools.length,
//       avgPoolSize: pools.length > 0 ? totalLiquidity / pools.length : 0,
//       ...swapAnalytics
//     };
//   };

//   const processPoolAnalytics = (pools: Pool[], allSwaps: SwapData[]): PoolAnalytics[] => {
//     return pools.map(pool => {
//       const token0Symbol = getTokenSymbol(pool.token0.id);
//       const token1Symbol = getTokenSymbol(pool.token1.id);
//       const token0Volume = safeParseFloat(pool.volumeToken0) / Math.pow(10, safeParseInt(pool.token0.decimals));
//       const token1Volume = safeParseFloat(pool.volumeToken1) / Math.pow(10, safeParseInt(pool.token1.decimals));
//       const volume24h = token0Volume + token1Volume;
//       const liquidity = safeParseFloat(pool.liquidity) / Math.pow(10, 18);
//       const swapCount = safeParseInt(pool.swapCount);
//       const fee = safeParseFloat(pool.fee) / 10000;
      
//       // Get swaps for this specific pool
//       const poolSwaps = allSwaps.filter(swap => 
//         swap.poolAddress.toLowerCase() === pool.address.toLowerCase()
//       );
      
//       const uniqueTraders = new Set(poolSwaps.map(swap => swap.sender)).size;
//       const avgGasUsed = poolSwaps.length > 0 
//         ? poolSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0) / poolSwaps.length 
//         : 0;
      
//       return {
//         address: pool.address,
//         token0Symbol,
//         token1Symbol,
//         pairName: `${token0Symbol}/${token1Symbol}`,
//         volume24h,
//         token0Volume,
//         token1Volume,
//         tvl: liquidity,
//         fees24h: volume24h * fee,
//         swapCount,
//         liquidity,
//         fee: fee,
//         volumeRatio: token1Volume > 0 ? token0Volume / token1Volume : 0,
//         liquidityUtilization: liquidity > 0 ? volume24h / liquidity : 0,
//         avgSwapSize: swapCount > 0 ? volume24h / swapCount : 0,
//         createdAt: safeParseInt(pool.createdAtTimestamp),
//         tick: safeParseInt(pool.tick),
//         sqrtPrice: safeParseFloat(pool.sqrtPrice),
//         recentSwaps: poolSwaps.slice(0, 5), // Store recent swaps
//         avgGasUsed,
//         uniqueTraders
//       };
//     }).sort((a, b) => b.volume24h - a.volume24h);
//   };

//   const processTimeseriesData = (timeseriesResponse: TimeseriesResponse, pools: Pool[], swaps: SwapData[]): ChartDataPoint[] => {
//     return timeseriesResponse.data.map(item => {
//       const volume = safeParseFloat(item.volume) / 1e18; // Convert from wei
//       const timeSwaps = swaps.filter(swap => 
//         Math.abs(swap.timestamp - item.time) < 3600 // Within 1 hour
//       );
      
//       const gasUsed = timeSwaps.length > 0 
//         ? timeSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasUsed), 0) / timeSwaps.length
//         : 0;
      
//       const gasPrice = timeSwaps.length > 0
//         ? timeSwaps.reduce((sum, swap) => sum + safeParseInt(swap.gasPrice), 0) / timeSwaps.length / 1e9 // Convert to Gwei
//         : 0;

//       return {
//         time: item.time,
//         volume,
//         swaps: timeSwaps.length,
//         fees: volume * 0.003, // Assuming 0.3% average fee
//         tvl: pools.reduce((sum, pool) => sum + safeParseFloat(pool.liquidity) / 1e18, 0),
//         token0Volume: volume * 0.5, // Approximate split
//         token1Volume: volume * 0.5,
//         avgSwapSize: timeSwaps.length > 0 ? volume / timeSwaps.length : 0,
//         poolCount: pools.length,
//         gasUsed,
//         gasPrice
//       };
//     });
//   };

//   const fetchData = useCallback(async (): Promise<void> => {
//     try {
//       setError(null);
      
//       const { interval, limit } = getTimeRangeParams(timeRange);
      
//       const [poolsRes, timeseriesRes, swapsRes] = await Promise.allSettled([
//         api.getPools(),
//         api.getTimeseries(interval, limit),
//         api.getSwaps(undefined, 500) // Get recent swaps across all pools
//       ]);
      
//       const pools: Pool[] = poolsRes.status === 'fulfilled' ? poolsRes.value.data : [];
//       const timeseriesData: TimeseriesResponse = timeseriesRes.status === 'fulfilled' 
//         ? timeseriesRes.value.data 
//         : { interval: 'hour', data: [] };
//       const allSwaps: SwapData[] = swapsRes.status === 'fulfilled' ? swapsRes.value.data.data : [];
      
//       const timeseries = processTimeseriesData(timeseriesData, pools, allSwaps);
//       const globalStats = calculateGlobalStats(pools, allSwaps);
//       const poolAnalytics = processPoolAnalytics(pools, allSwaps);

//       setData({
//         pools,
//         timeseries,
//         globalStats,
//         poolAnalytics,
//         allSwaps
//       });

//     } catch (err: any) {
//       console.error('Error fetching data:', err);
//       setError('Failed to fetch data from API');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [timeRange]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleRefresh = (): void => {
//     setRefreshing(true);
//     fetchData();
//   };

//   const formatCurrency = (value: number): string => {
//     if (!value || isNaN(value)) return '$0';
    
//     if (value >= 1e9) {
//       return `$${(value / 1e9).toFixed(2)}B`;
//     } else if (value >= 1e6) {
//       return `$${(value / 1e6).toFixed(2)}M`;
//     } else if (value >= 1e3) {
//       return `$${(value / 1e3).toFixed(2)}K`;
//     }
    
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(value);
//   };

//   const formatNumber = (value: number): string => {
//     if (!value || isNaN(value)) return '0';
    
//     if (value >= 1e9) {
//       return `${(value / 1e9).toFixed(2)}B`;
//     } else if (value >= 1e6) {
//       return `${(value / 1e6).toFixed(2)}M`;
//     } else if (value >= 1e3) {
//       return `${(value / 1e3).toFixed(2)}K`;
//     }
    
//     return value.toLocaleString();
//   };

//   const formatTime = (timestamp: number): string => {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatGwei = (value: number): string => {
//     return `${value.toFixed(2)} Gwei`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-600 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchData}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">DeFi Analytics Dashboard</h1>
//             <p className="text-gray-600">Comprehensive analytics for {data.pools.length} pools • {data.allSwaps.length} recent swaps</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>

//         {/* Time Range Selection */}
//         <div className="mb-6 flex gap-2">
//           {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
//             <button
//               key={range}
//               onClick={() => setTimeRange(range)}
//               className={`px-3 py-1 rounded ${
//                 timeRange === range
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               {range.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         {/* Enhanced Key Metrics */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Total Volume</p>
//             <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalVolume)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Total TVL</p>
//             <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalValueLocked)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Total Swaps</p>
//             <h3 className="text-lg font-bold">{formatNumber(data.globalStats.totalSwaps)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Total Fees</p>
//             <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalFees)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Unique Users</p>
//             <h3 className="text-lg font-bold">{formatNumber(data.globalStats.uniqueUsers)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Avg Gas Used</p>
//             <h3 className="text-lg font-bold">{formatNumber(data.globalStats.avgGasUsed)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Avg Gas Price</p>
//             <h3 className="text-lg font-bold">{formatGwei(data.globalStats.avgGasPrice)}</h3>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <p className="text-xs text-gray-600">Total Gas Spent</p>
//             <h3 className="text-lg font-bold">{formatCurrency(data.globalStats.totalGasSpent)}</h3>
//           </div>
//         </div>

//         {/* Enhanced Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//           {/* Volume vs Swaps */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Volume vs Swap Count</h3>
//             <div className="h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={data.timeseries}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tickFormatter={formatTime} />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume" />
//                   <Line yAxisId="right" type="monotone" dataKey="swaps" stroke="#dc2626" name="Swaps" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Gas Analytics */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Gas Usage Analytics</h3>
//             <div className="h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={data.timeseries}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tickFormatter={formatTime} />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Bar yAxisId="left" dataKey="gasUsed" fill="#059669" name="Gas Used" />
//                   <Line yAxisId="right" type="monotone" dataKey="gasPrice" stroke="#ea580c" name="Gas Price (Gwei)" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* TVL Over Time */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">TVL Trend</h3>
//             <div className="h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={data.timeseries}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tickFormatter={formatTime} />
//                   <YAxis />
//                   <Tooltip />
//                   <Area type="monotone" dataKey="tvl" stroke="#7c3aed" fill="#a855f7" fillOpacity={0.3} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Average Swap Size vs Count */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Swap Size vs Count</h3>
//             <div className="h-[250px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={data.timeseries}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tickFormatter={formatTime} />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip />
//                   <Line yAxisId="left" type="monotone" dataKey="avgSwapSize" stroke="#ea580c" strokeWidth={2} name="Avg Swap Size" />
//                   <Bar yAxisId="right" dataKey="swaps" fill="#0891b2" name="Swap Count" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Pool Distribution Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//           {/* Volume Distribution Pie Chart */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Volume Distribution (Top 8)</h3>
//             <div className="h-[200px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={data.poolAnalytics.slice(0, 8).map((pool, index) => ({
//                       name: pool.pairName,
//                       value: pool.volume24h,
//                       fill: COLORS[index]
//                     }))}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={80}
//                     dataKey="value"
//                   />
//                   <Tooltip formatter={(value) => formatCurrency(value as number)} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Unique Traders Distribution */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Unique Traders per Pool</h3>
//             <div className="h-[200px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data.poolAnalytics.slice(0, 8)}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="pairName" tick={{ fontSize: 10 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="uniqueTraders" fill="#7c3aed" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Gas Usage by Pool */}
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-2">Avg Gas Usage by Pool</h3>
//             <div className="h-[200px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={data.poolAnalytics.slice(0, 8)}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="pairName" tick={{ fontSize: 10 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="avgGasUsed" fill="#059669" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Recent Swaps Table */}
//         <div className="bg-white rounded shadow p-4 mb-6">
//           <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-2 px-2">Pool</th>
//                   <th className="text-left py-2 px-2">Trader</th>
//                   <th className="text-right py-2 px-2">Amount 0</th>
//                   <th className="text-right py-2 px-2">Amount 1</th>
//                   <th className="text-right py-2 px-2">Gas Used</th>
//                   <th className="text-right py-2 px-2">Gas Price</th>
//                   <th className="text-right py-2 px-2">Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.allSwaps.slice(0, 10).map((swap) => (
//                   <tr key={swap.id} className="border-b border-gray-100">
//                     <td className="py-2 px-2 font-mono text-xs">{swap.poolAddress.slice(0, 8)}...</td>
//                     <td className="py-2 px-2 font-mono text-xs">{swap.sender.slice(0, 8)}...</td>
//                     <td className="text-right py-2 px-2">{(safeParseFloat(swap.amount0) / 1e18).toFixed(4)}</td>
//                     <td className="text-right py-2 px-2">{(safeParseFloat(swap.amount1) / 1e18).toFixed(4)}</td>
//                     <td className="text-right py-2 px-2">{formatNumber(safeParseInt(swap.gasUsed))}</td>
//                     <td className="text-right py-2 px-2">{formatGwei(safeParseFloat(swap.gasPrice) / 1e9)}</td>
//                     <td className="text-right py-2 px-2">{formatTime(swap.timestamp)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Enhanced Pool Analytics Table */}
//         <div className="bg-white rounded shadow p-4">
//           <h3 className="text-lg font-semibold mb-4">Detailed Pool Analytics</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="border-b">
//                   <th className="text-left py-2 px-2">Pool</th>
//                   <th className="text-right py-2 px-2">Volume 24h</th>
//                   <th className="text-right py-2 px-2">TVL</th>
//                   <th className="text-right py-2 px-2">Fees 24h</th>
//                   <th className="text-right py-2 px-2">Swaps</th>
//                   <th className="text-right py-2 px-2">Fee %</th>
//                   <th className="text-right py-2 px-2">Avg Swap</th>
//                   <th className="text-right py-2 px-2">Unique Traders</th>
//                   <th className="text-right py-2 px-2">Avg Gas</th>
//                   <th className="text-right py-2 px-2">Utilization</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.poolAnalytics.slice(0, 20).map((pool) => (
//                   <tr key={pool.address} className="border-b border-gray-100">
//                     <td className="py-2 px-2 font-medium">{pool.pairName}</td>
//                     <td className="text-right py-2 px-2">{formatCurrency(pool.volume24h)}</td>
//                     <td className="text-right py-2 px-2">{formatCurrency(pool.tvl)}</td>
//                     <td className="text-right py-2 px-2">{formatCurrency(pool.fees24h)}</td>
//                     <td className="text-right py-2 px-2">{formatNumber(pool.swapCount)}</td>
//                     <td className="text-right py-2 px-2">{pool.fee.toFixed(3)}%</td>
//                     <td className="text-right py-2 px-2">{formatCurrency(pool.avgSwapSize)}</td>
//                     <td className="text-right py-2 px-2">{pool.uniqueTraders || 0}</td>
//                     <td className="text-right py-2 px-2">{formatNumber(pool.avgGasUsed || 0)}</td>
//                     <td className="text-right py-2 px-2">{(pool.liquidityUtilization * 100).toFixed(2)}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeFiAnalyticsDashboard;