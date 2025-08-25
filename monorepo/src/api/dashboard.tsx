import { Pool, SwapData, SwapResponse, TimeseriesResponse } from '@/utils/interfaces';
import axios, { AxiosResponse } from 'axios';
import LixerSDK from '@lixersdk/sdk';


const API_BASE_URL = 'https://lixer.onrender.com';

const lixer = new LixerSDK();

export const dashboardApi = {
    getPools: async (): Promise<Pool[]> => {
    const sdkPools = await lixer.pools().getAll();

    return sdkPools.map((pool: any) => ({
      address: pool.address,
      metadata: pool.metadata,
      ...pool,
    }));
  },

  getTimeseries: (interval: string = 'hour', limit: number = 24): Promise<AxiosResponse<TimeseriesResponse>> => 
    axios.get(`${API_BASE_URL}/timeseries/volume?interval=${interval}&limit=${limit}`),

  getSwaps: (poolAddress?: string, limit: number = 100): Promise<AxiosResponse<SwapResponse>> => {
    const url = poolAddress 
      ? `${API_BASE_URL}/swaps?pool=${poolAddress}&limit=${limit}`
      : `${API_BASE_URL}/swaps?limit=${limit}`;
    return axios.get(url);
  },

  // getSwaps: async (): Promise<SwapData[]> => {
  //   return await lixer.swaps.getAll();
  // },
};