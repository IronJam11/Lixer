'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, TrendingUp, Users, DollarSign, Clock, Hash } from 'lucide-react';
import { poolAnalyticsApi } from '@/api/pool';

// Types
interface TimeSeriesData {
  time: number;
  volume: string;
}

interface SwapData {
  id: string;
  txHash: string;
  poolAddress: string;
  sender: string;
  recipient: string;
  amount0: string;
  amount1: string;
  sqrtPriceX96: string;
  liquidity: string;
  tick: number;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
}

interface PoolStats {
  poolAddress: string;
  swapCount24h: number;
  volume24h: string;
  averageSwapSize: string;
  uniqueTraders24h: number;
}


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function PoolAnalytics() {
  const params = useParams();
  const poolAddress = params?.address as string;
  console.log("Pool Address from URL:", poolAddress);
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [swapsData, setSwapsData] = useState<SwapData[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolAddress) return;

   const fetchData = async () => {
  setLoading(true);
  setError(null);
  console.log("Starting API calls for pool:", poolAddress);
  
  try {
      const [timeSeriesResponse, swapsResponse, statsResponse] = await Promise.all([
          poolAnalyticsApi.getPoolTimeseries(poolAddress),
          poolAnalyticsApi.getPoolSwaps(poolAddress),
          poolAnalyticsApi.getPoolStats(poolAddress)
      ]);

      console.log("Time series data:", timeSeriesResponse.data);
      console.log("Swaps data:", swapsResponse.data);
      console.log("Stats data:", statsResponse.data);

      setTimeSeriesData(timeSeriesResponse.data.data || []);
      setSwapsData(swapsResponse.data.data || []);
      setPoolStats(statsResponse.data);
    } catch (err: any) {
      console.error('Detailed error:', err.response?.data || err.message);
      setError('Failed to fetch pool data. Please check if the API is running and the pool address is valid.');
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [poolAddress]);

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1e18) return `${(num / 1e18).toFixed(2)}E`;
    if (num >= 1e15) return `${(num / 1e15).toFixed(2)}P`;
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const chartTimeSeriesData = timeSeriesData.map(item => ({
    time: new Date(item.time * 1000).toLocaleTimeString(),
    volume: parseFloat(item.volume) / 1e18,
    timestamp: item.time
  }));

  const recentSwapsData = swapsData.slice(0, 10).map((swap, index) => ({
    name: `Swap ${index + 1}`,
    amount0: Math.abs(parseFloat(swap.amount0)) / 1e18,
    amount1: Math.abs(parseFloat(swap.amount1)) / 1e9,
    gasUsed: parseInt(swap.gasUsed)
  }));

  const gasUsageData = swapsData.slice(0, 20).map((swap, index) => ({
    swap: `${index + 1}`,
    gasUsed: parseInt(swap.gasUsed),
    gasPrice: parseFloat(swap.gasPrice) / 1e9
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading pool analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pool Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">
            Pool Address: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{poolAddress}</span>
          </p>
        </div>

        {/* Stats Cards */}
        {poolStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">24h Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">{poolStats.swapCount24h.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">24h Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{formatVolume(poolStats.volume24h)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Swap Size</p>
                  <p className="text-2xl font-bold text-gray-900">{formatVolume(poolStats.averageSwapSize)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Traders</p>
                  <p className="text-2xl font-bold text-gray-900">{poolStats.uniqueTraders24h}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Time Series */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Volume Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis tickFormatter={(value) => `${value.toFixed(0)}E`} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}E`, 'Volume']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Swaps Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Swap Amounts</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentSwapsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount0" fill="#8884d8" name="Amount 0" />
                <Bar dataKey="amount1" fill="#82ca9d" name="Amount 1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gas Usage Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Gas Usage Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="swap" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="gasUsed" 
                stroke="#8884d8" 
                name="Gas Used"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="gasPrice" 
                stroke="#82ca9d" 
                name="Gas Price (Gwei)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Swaps Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Swaps</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount 0
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {swapsData.slice(0, 10).map((swap, index) => (
                  <tr key={swap.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                      {formatAddress(swap.txHash)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {formatAddress(swap.sender)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatVolume(swap.amount0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatVolume(swap.amount1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(swap.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseInt(swap.gasUsed).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}