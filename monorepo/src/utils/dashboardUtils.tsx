import React from "react";
import { TimeRange } from "./constants";

export  const formatCurrency = (value: number): string => {
    if (!value || isNaN(value)) return '$0';
    
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

export const formatNumber = (value: number): string => {
    if (!value || isNaN(value)) return '0';
    
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    
    return value.toLocaleString();
  };

export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
export const formatGwei = (value: number): string => {
    return `${value.toFixed(2)} Gwei`;
  };

export const getTokenSymbol = (tokenId: string): string => {
   
    return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
  };

export   const safeParseFloat = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0;
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? 0 : parsed;
  };

export   const safeParseInt = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0;
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(parsed) ? 0 : parsed;
  };
export const getTimeRangeParams = (timeRange: TimeRange) => {
    switch (timeRange) {
      case '1h':
        return { interval: 'minute', limit: 60 };
      case '24h':
        return { interval: 'hour', limit: 24 };
      case '7d':
        return { interval: 'hour', limit: 168 }; // 24 * 7
      case '30d':
        return { interval: 'day', limit: 30 };
      default:
        return { interval: 'hour', limit: 24 };
    }
  };