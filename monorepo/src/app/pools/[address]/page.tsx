'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import lixerLogo from '@/assets/logos/Lixer.png';
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src={lixerLogo} width={96} height={96} alt="Lixer logo" className="animate-bounce mb-6" />
          <div className="text-gray-300 text-xl font-light">Loading analytics...</div>
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
  <div className="min-h-screen bg-black p-4">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-light text-white mb-4">
          Pool Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-400">
          Pool Address: <span className="font-mono bg-gray-900 px-3 py-2 rounded text-teal-300">{poolAddress}</span>
        </p>
      </div>

      {/* Stats Cards */}
      {poolStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-teal-500/20">
            <div className="flex items-center">
              <div className="p-3 bg-teal-500/20 rounded-xl mr-4">
                <Activity className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">24h Swaps</p>
                <p className="text-3xl font-light text-white">{poolStats.swapCount24h.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-teal-500/20">
            <div className="flex items-center">
              <div className="p-3 bg-teal-500/20 rounded-xl mr-4">
                <TrendingUp className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">24h Volume</p>
                <p className="text-3xl font-light text-white">{formatVolume(poolStats.volume24h)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-teal-500/20">
            <div className="flex items-center">
              <div className="p-3 bg-teal-500/20 rounded-xl mr-4">
                <DollarSign className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Avg Swap Size</p>
                <p className="text-3xl font-light text-white">{formatVolume(poolStats.averageSwapSize)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-teal-500/20">
            <div className="flex items-center">
              <div className="p-3 bg-teal-500/20 rounded-xl mr-4">
                <Users className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Unique Traders</p>
                <p className="text-3xl font-light text-white">{poolStats.uniqueTraders24h}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Volume Time Series */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
          <h3 className="text-2xl font-light text-white mb-6">
            Volume Over Time
          </h3>
          <div className="bg-black/50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis tickFormatter={(value) => `${value.toFixed(0)}E`} stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}E`, 'Volume']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#14B8A6" 
                  strokeWidth={2}
                  dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0D9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Swaps Bar Chart */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
          <h3 className="text-2xl font-light text-white mb-6">
            Recent Swap Amounts
          </h3>
          <div className="bg-black/50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentSwapsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="amount0" fill="#14B8A6" name="Amount 0" />
                <Bar dataKey="amount1" fill="#0D9488" name="Amount 1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gas Usage Chart */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-800">
        <h3 className="text-2xl font-light text-white mb-6">
          Gas Usage Analysis
        </h3>
        <div className="bg-black/50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="swap" stroke="#9CA3AF" />
              <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="gasUsed" 
                stroke="#14B8A6" 
                strokeWidth={2}
                name="Gas Used"
                dot={{ fill: '#14B8A6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="gasPrice" 
                stroke="#0D9488" 
                strokeWidth={2}
                name="Gas Price (Gwei)"
                dot={{ fill: '#0D9488', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Swaps Table */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
        <h3 className="text-2xl font-light text-white mb-6">
          Recent Swaps
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-black/30">
                <th className="px-6 py-4 text-left text-sm font-medium text-teal-300 uppercase tracking-wider border-b border-gray-800">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  Sender
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  Amount 0
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  Amount 1
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  Gas Used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {swapsData.slice(0, 10).map((swap, index) => (
                <tr 
                  key={swap.id} 
                  className={`${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'} hover:bg-teal-500/5 transition-all duration-300`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-teal-400">
                    {formatAddress(swap.txHash)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    {formatAddress(swap.sender)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatVolume(swap.amount0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatVolume(swap.amount1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatTimestamp(swap.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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