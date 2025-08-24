import { Pool, SwapResponse, TimeseriesResponse } from '@/utils/interfaces';
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const dashboardApi = {
  getPools: (): Promise<AxiosResponse<Pool[]>> => 
    axios.get(`${API_BASE_URL}/pools`),
  
  getTimeseries: (interval: string = 'hour', limit: number = 24): Promise<AxiosResponse<TimeseriesResponse>> => 
    axios.get(`${API_BASE_URL}/timeseries/volume?interval=${interval}&limit=${limit}`),

  getSwaps: (poolAddress?: string, limit: number = 100): Promise<AxiosResponse<SwapResponse>> => {
    const url = poolAddress 
      ? `${API_BASE_URL}/swaps?pool=${poolAddress}&limit=${limit}`
      : `${API_BASE_URL}/swaps?limit=${limit}`;
    return axios.get(url);
  },
};