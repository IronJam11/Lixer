import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart
} from 'recharts';
import { formatTime } from "@/utils/dashboardUtils";

export const EnhancedChartsGrid: React.FC<{ data: any }> = ({ data }) => {
return (
  <div className="min-h-screen bg-black text-white px-6 py-8">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-gray-300 mb-4">
          DEX <span className="text-teal-300">Analytics</span>
        </h1>
        <p className="text-gray-400 text-lg">Real-time insights into decentralized exchange activity</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Volume vs Swaps */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-light text-gray-300">Volume vs Swap Count</h3>
            <p className="text-sm text-gray-500 mt-1">Trading volume compared to transaction frequency</p>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatTime}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="volume" fill="#0D9488" name="Volume" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="swaps" stroke="#F59E0B" strokeWidth={2} name="Swaps" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gas Analytics */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-light text-gray-300">Gas Usage Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">Gas consumption and pricing trends</p>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatTime}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="gasUsed" fill="#8B5CF6" name="Gas Used" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="gasPrice" stroke="#EF4444" strokeWidth={2} name="Gas Price (Gwei)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TVL Over Time */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-light text-gray-300">TVL Trend</h3>
            <p className="text-sm text-gray-500 mt-1">Total value locked over time</p>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatTime}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tvl" 
                    stroke="#06B6D4" 
                    fill="#06B6D4" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Average Swap Size vs Count */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-light text-gray-300">Swap Size vs Count</h3>
            <p className="text-sm text-gray-500 mt-1">Average transaction size and frequency</p>
          </div>
          <div className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.timeseries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatTime}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="avgSwapSize" 
                    stroke="#F97316" 
                    strokeWidth={2} 
                    name="Avg Swap Size" 
                  />
                  <Bar yAxisId="right" dataKey="swaps" fill="#14B8A6" name="Swap Count" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Real-time data powered by <span className="text-teal-300">Liquid Labs and Goldsky</span>
        </p>
      </div>
    </div>
  </div>
);
}
