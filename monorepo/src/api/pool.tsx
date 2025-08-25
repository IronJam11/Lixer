import axios, { AxiosResponse } from 'axios';
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

interface ApiResponse<T> {
  poolAddress: string;
  data?: T[];
  interval?: string;
  swapCount24h?: number;
  volume24h?: string;
  averageSwapSize?: string;
  uniqueTraders24h?: number;
}

const API_BASE_URL = 'https://lixer.onrender.com';

export const poolAnalyticsApi = {
  getPoolTimeseries: (poolAddress: string): Promise<AxiosResponse<ApiResponse<TimeSeriesData>>> =>
    axios.get(`${API_BASE_URL}/pools/${poolAddress}/timeseries/swaps`),

  getPoolSwaps: (poolAddress: string): Promise<AxiosResponse<ApiResponse<SwapData>>> =>
    axios.get(`${API_BASE_URL}/pools/${poolAddress}/swaps`),

  getPoolStats: (poolAddress: string): Promise<AxiosResponse<PoolStats>> =>
    axios.get(`${API_BASE_URL}/stats/pools/${poolAddress}`),
};