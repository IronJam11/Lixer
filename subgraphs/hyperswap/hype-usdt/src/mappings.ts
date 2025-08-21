import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { Swap as SwapEvent } from "../generated/Pool/Pool"
import { Swap, Pool } from "../generated/schema"

export function handleSwap(event: SwapEvent): void {
  let poolAddress = event.address.toHexString()
  

  let pool = Pool.load(poolAddress)
  if (pool == null) {
    pool = new Pool(poolAddress)
    pool.swapCount = BigInt.fromI32(0)
    pool.totalVolumeAmount0 = BigInt.fromI32(0)
    pool.totalVolumeAmount1 = BigInt.fromI32(0)
  }
  
  
  pool.swapCount = pool.swapCount.plus(BigInt.fromI32(1))
  pool.totalVolumeAmount0 = pool.totalVolumeAmount0.plus(event.params.amount0.abs())
  pool.totalVolumeAmount1 = pool.totalVolumeAmount1.plus(event.params.amount1.abs())
  pool.save()

  let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  
  let swap = new Swap(swapId)
  
  swap.transaction = event.transaction.hash
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.pool = poolAddress 
  swap.sender = event.params.sender
  swap.recipient = event.params.recipient
  swap.amount0 = event.params.amount0
  swap.amount1 = event.params.amount1
  swap.sqrtPriceX96 = event.params.sqrtPriceX96
  swap.liquidity = event.params.liquidity
  swap.tick = event.params.tick
  
  let receipt = event.receipt
  if (receipt != null) {
    swap.gasUsed = receipt.gasUsed
  } else {
    swap.gasUsed = BigInt.fromI32(0)
  }
  
  swap.gasPrice = event.transaction.gasPrice
  
  swap.save()
}