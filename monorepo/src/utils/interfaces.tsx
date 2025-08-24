export interface TokenInfo {
  id: string;
  decimals: string;
}

export interface Factory {
  id: string;
}

export interface Pool {
  id: string;
  address: string;
  factory: Factory;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: string;
  tickSpacing: string;
  liquidity: string;
  sqrtPrice: string;
  tick: string;
  volumeToken0: string;
  volumeToken1: string;
  swapCount: string;
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
  metadata: any;
}

export interface TimeseriesResponse {
  interval: string;
  data: {
    time: number;
    volume: string;
  }[];
}

export interface SwapData {
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

export interface SwapResponse {
  data: SwapData[];
}

export interface GlobalStats {
  totalValueLocked: number;
  totalVolume: number;
  totalFees: number;
  totalSwaps: number;
  totalPools: number;
  avgPoolSize: number;
  totalToken0Volume: number;
  totalToken1Volume: number;
  avgGasUsed: number;
  avgGasPrice: number;
  uniqueUsers: number;
  totalGasSpent: number;
}

export interface ChartDataPoint {
  time: number;
  volume: number;
  swaps: number;
  fees: number;
  tvl: number;
  token0Volume: number;
  token1Volume: number;
  avgSwapSize: number;
  poolCount: number;
  gasUsed?: number;
  gasPrice?: number;
}

export interface PoolAnalytics {
  address: string;
  token0Symbol: string;
  token1Symbol: string;
  pairName: string;
  volume24h: number;
  tvl: number;
  fees24h: number;
  swapCount: number;
  liquidity: number;
  fee: number;
  volumeRatio: number;
  liquidityUtilization: number;
  avgSwapSize: number;
  createdAt: number;
  tick: number;
  sqrtPrice: number;
  token0Volume: number;
  token1Volume: number;
  recentSwaps?: SwapData[];
  avgGasUsed?: number;
  uniqueTraders?: number;
}

export interface DashboardData {
  pools: Pool[];
  timeseries: ChartDataPoint[];
  globalStats: GlobalStats;
  poolAnalytics: PoolAnalytics[];
  allSwaps: SwapData[];
}

interface TimeSeriesData {
  time: number;
  volume: string;
}

