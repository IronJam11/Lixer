declare module '@lixersdk/sdk' {
  export interface SwapEvent {
    id: string;
    blockNumber: number;
    blockHash: string;
    transactionHash: string;
    logIndex: number;
    poolAddress: string;
    timestamp: number;
    timestampISO: string;
    sender: string;
    recipient: string;
    amount0: string;
    amount1: string;
    sqrtPriceX96: string;
    liquidity: string;
    tick: string;
  }

  export interface Pool {
    id: string;
    factory: string;
    token0: string;
    token1: string;
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
  }

  export interface PoolStats {
    totalVolume: string;
    volume24h: string;
    liquidity: string;
    swapCount: number;
    fees24h: string;
  }

  export interface GlobalStats {
    totalPools: number;
    totalSwaps: number;
    totalVolume: string;
    volume24h: string;
  }

  export interface TimeSeriesData {
    timestamp: number;
    volume: string;
    swapCount: number;
    liquidity: string;
  }

  export interface WebSocketData {
    url: string;
    port: number;
  }

  export interface SwapsService {
    getAll(options?: { limit?: number; offset?: number; pool?: string }): Promise<SwapEvent[]>;
    getById(id: string): Promise<SwapEvent>;
  }

  export interface PoolsService {
    getAll(): Promise<Pool[]>;
    getSwaps(poolAddress: string, options?: { limit?: number; offset?: number }): Promise<SwapEvent[]>;
    getTimeSeries(poolAddress: string, options?: { interval?: string; limit?: number }): Promise<TimeSeriesData[]>;
  }

  export interface StatsService {
    getGlobal(): Promise<GlobalStats>;
    getPool(poolAddress: string): Promise<PoolStats>;
  }

  export interface TimeseriesService {
    getSwaps(options?: { interval?: string; limit?: number }): Promise<TimeSeriesData[]>;
  }

  export interface HealthService {
    check(): Promise<{ status: string; timestamp: number }>;
  }

  export interface WebSocketService {
    getUrl(): Promise<WebSocketData>;
    connect(wsURL?: string): Promise<WebSocket>;
  }

  export default class LixerSDK {
    constructor(baseURL?: string);
    
    info(): Promise<{
      message: string;
      version: string;
      endpoints: Record<string, string>;
    }>;
    
    swaps(): SwapsService;
    pools(): PoolsService;
    stats(): StatsService;
    timeseries(): TimeseriesService;
    health(): HealthService;
    websocket(): WebSocketService;
  }
}
