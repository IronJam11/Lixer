import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Timer, ArrowUpDown, Users, Volume2, Calendar, RefreshCw, Zap } from 'lucide-react';
import { formatCurrency } from "@/utils/dashboardUtils";
import { COLORS } from "@/utils/constants";

export const PoolDistributionCharts: React.FC<{ data: any }> = ({ data }) => {
  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
    
    {/* Volume Distribution Pie Chart */}
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-light text-gray-300">Volume Distribution</h3>
        <p className="text-sm text-gray-500 mt-1">Top 8 pools by trading volume</p>
      </div>
      <div className="p-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.poolAnalytics.slice(0, 8).map((pool: { pairName: any; volume24h: any; }, index: number) => ({
                  name: pool.pairName,
                  value: pool.volume24h,
                  fill: COLORS[index]
                }))}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                strokeWidth={2}
                stroke="#111827"
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Unique Traders Distribution */}
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-light text-gray-300">Unique Traders</h3>
        <p className="text-sm text-gray-500 mt-1">Active traders per pool</p>
      </div>
      <div className="p-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.poolAnalytics.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="pairName" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                stroke="#9CA3AF"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar 
                dataKey="uniqueTraders" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Gas Usage by Pool */}
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-light text-gray-300">Gas Usage</h3>
        <p className="text-sm text-gray-500 mt-1">Average gas consumption by pool</p>
      </div>
      <div className="p-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.poolAnalytics.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="pairName" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                stroke="#9CA3AF"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                stroke="#9CA3AF"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar 
                dataKey="avgGasUsed" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  </div>
);
}