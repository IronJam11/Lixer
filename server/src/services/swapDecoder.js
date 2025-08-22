const { ethers } = require('ethers');


class SwapEventDecoder {
  constructor() {
    
    this.swapEventABI = [
      "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)"
    ];
    
    
    this.iface = new ethers.Interface(this.swapEventABI);
    
  }

 
  decodeSwapEvent(logEntry) {
    try {
      
      let topics;
      if (typeof logEntry.topics === 'string') {
        topics = logEntry.topics.split(',').map(topic => topic.trim());
      } else {
        topics = logEntry.topics;
      }

      const log = {
        topics: topics,
        data: logEntry.data
      };

      const decoded = this.iface.parseLog(log);
      
      const swapData = {
        eventName: decoded.name,
        blockNumber: parseInt(logEntry.block_number),
        blockHash: logEntry.block_hash,
        transactionHash: logEntry.transaction_hash,
        logIndex: parseInt(logEntry.log_index),
        poolAddress: logEntry.address,
        timestamp: parseInt(logEntry.block_timestamp),
        timestampISO: new Date(parseInt(logEntry.block_timestamp) * 1000).toISOString(),
        
        sender: decoded.args.sender,
        recipient: decoded.args.recipient,
        amount0: decoded.args.amount0.toString(),
        amount1: decoded.args.amount1.toString(),
        sqrtPriceX96: decoded.args.sqrtPriceX96.toString(),
        liquidity: decoded.args.liquidity.toString(),
        tick: decoded.args.tick.toString(),
        
      };

      return swapData;
    } catch (error) {
      console.error('Error decoding swap event:', error);
      return {
        error: 'Failed to decode swap event',
        originalData: logEntry,
        errorMessage: error.message
      };
    }
  }

  calculatePrice(sqrtPriceX96) {
    try {
      const Q96 = BigInt(2) ** BigInt(96);
      const sqrtPrice = Number(sqrtPriceX96) / Number(Q96);
      const price = sqrtPrice * sqrtPrice;
      return price.toFixed(10);
    } catch (error) {
      return 'Error calculating price';
    }
  }

  formatAmount(amount, decimals = 18) {
    try {
      const divisor = BigInt(10) ** BigInt(decimals);
      const wholePart = amount / divisor;
      const fractionalPart = amount % divisor;
      
      if (fractionalPart === 0n) {
        return wholePart.toString();
      }
      
      const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
      const trimmedFractional = fractionalStr.replace(/0+$/, '');
      
      if (trimmedFractional === '') {
        return wholePart.toString();
      }
      
      return `${wholePart}.${trimmedFractional}`;
    } catch (error) {
      return amount.toString();
    }
  }

  formatLiquidity(liquidity) {
    const num = BigInt(liquidity);
    if (num > BigInt(1e12)) {
      return `${(Number(num) / 1e12).toFixed(2)}T`;
    } else if (num > BigInt(1e9)) {
      return `${(Number(num) / 1e9).toFixed(2)}B`;
    } else if (num > BigInt(1e6)) {
      return `${(Number(num) / 1e6).toFixed(2)}M`;
    } else if (num > BigInt(1e3)) {
      return `${(Number(num) / 1e3).toFixed(2)}K`;
    }
    return num.toString();
  }

  batchDecode(logEntries) {
    return logEntries.map(entry => this.decodeSwapEvent(entry));
  }

  getSwapStatistics(decodedSwaps) {
    const validSwaps = decodedSwaps.filter(swap => !swap.error);
    
    if (validSwaps.length === 0) {
      return { error: 'No valid swaps to analyze' };
    }

    const totalSwaps = validSwaps.length;
    const uniquePools = new Set(validSwaps.map(swap => swap.poolAddress)).size;
    const uniqueUsers = new Set(validSwaps.map(swap => swap.sender)).size;
    
    const timeRange = {
      earliest: Math.min(...validSwaps.map(swap => swap.timestamp)),
      latest: Math.max(...validSwaps.map(swap => swap.timestamp))
    };

    return {
      totalSwaps,
      uniquePools,
      uniqueUsers,
      timeRange: {
        earliest: timeRange.earliest,
        latest: timeRange.latest,
        earliestISO: new Date(timeRange.earliest * 1000).toISOString(),
        latestISO: new Date(timeRange.latest * 1000).toISOString(),
        durationHours: (timeRange.latest - timeRange.earliest) / 3600
      }
    };
  }
}

module.exports = SwapEventDecoder;
