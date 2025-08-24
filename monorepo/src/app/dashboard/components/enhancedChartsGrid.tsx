import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Timer, ArrowUpDown, Users, Volume2, Calendar, RefreshCw, Zap } from 'lucide-react';
import { formatTime } from "@/utils/dashboardUtils";

export const EnhancedChartsGrid: React.FC<{ data: any }> = ({ data }) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Volume vs Swaps */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Volume vs Swap Count</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.timeseries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickFormatter={formatTime} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume" />
                      <Line yAxisId="right" type="monotone" dataKey="swaps" stroke="#dc2626" name="Swaps" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* Gas Analytics */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Gas Usage Analytics</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.timeseries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickFormatter={formatTime} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="gasUsed" fill="#059669" name="Gas Used" />
                      <Line yAxisId="right" type="monotone" dataKey="gasPrice" stroke="#ea580c" name="Gas Price (Gwei)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* TVL Over Time */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">TVL Trend</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.timeseries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickFormatter={formatTime} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="tvl" stroke="#7c3aed" fill="#a855f7" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* Average Swap Size vs Count */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Swap Size vs Count</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.timeseries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tickFormatter={formatTime} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="avgSwapSize" stroke="#ea580c" strokeWidth={2} name="Avg Swap Size" />
                      <Bar yAxisId="right" dataKey="swaps" fill="#0891b2" name="Swap Count" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
  );
}