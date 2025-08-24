import React from "react";
import { formatCurrency, formatNumber } from "@/utils/dashboardUtils";


export const EnhancedPoolAnalyticsTable: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Detailed Pool Analytics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Pool</th>
                      <th className="text-right py-2 px-2">Volume 24h</th>
                      <th className="text-right py-2 px-2">TVL</th>
                      <th className="text-right py-2 px-2">Fees 24h</th>
                      <th className="text-right py-2 px-2">Swaps</th>
                      <th className="text-right py-2 px-2">Fee %</th>
                      <th className="text-right py-2 px-2">Avg Swap</th>
                      <th className="text-right py-2 px-2">Unique Traders</th>
                      <th className="text-right py-2 px-2">Avg Gas</th>
                      <th className="text-right py-2 px-2">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.poolAnalytics.slice(0, 20).map((pool: { address: React.Key | null | undefined; pairName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; volume24h: number; tvl: number; fees24h: number; swapCount: number; fee: number; avgSwapSize: number; uniqueTraders: any; avgGasUsed: any; liquidityUtilization: number; }) => (
                      <tr key={pool.address} className="border-b border-gray-100">
                        <td className="py-2 px-2 font-medium">{pool.pairName}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(pool.volume24h)}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(pool.tvl)}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(pool.fees24h)}</td>
                        <td className="text-right py-2 px-2">{formatNumber(pool.swapCount)}</td>
                        <td className="text-right py-2 px-2">{pool.fee.toFixed(3)}%</td>
                        <td className="text-right py-2 px-2">{formatCurrency(pool.avgSwapSize)}</td>
                        <td className="text-right py-2 px-2">{pool.uniqueTraders || 0}</td>
                        <td className="text-right py-2 px-2">{formatNumber(pool.avgGasUsed || 0)}</td>
                        <td className="text-right py-2 px-2">{(pool.liquidityUtilization * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  );
}