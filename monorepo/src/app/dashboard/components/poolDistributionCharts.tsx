import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Timer, ArrowUpDown, Users, Volume2, Calendar, RefreshCw, Zap } from 'lucide-react';
import { formatCurrency } from "@/utils/dashboardUtils";

export const poolDistributionCharts: React.FC<{ data: any }> = ({ data }) => {
  return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Volume Distribution Pie Chart */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Volume Distribution (Top 8)</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.poolAnalytics.slice(0, 8).map((pool, index) => ({
                          name: pool.pairName,
                          value: pool.volume24h,
                          fill: COLORS[index]
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
    
              {/* Unique Traders Distribution */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Unique Traders per Pool</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.poolAnalytics.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pairName" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uniqueTraders" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Avg Gas Usage by Pool</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.poolAnalytics.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pairName" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgGasUsed" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
    
  );
}