import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { Swap as SwapEvent } from "../generated/Pool/Pool"
import { Swap } from "../generated/schema"

export function handleSwap(event: SwapEvent): void {

  let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  
  
  let swap = new Swap(swapId)
  
  
  swap.transaction = event.transaction.hash
  swap.timestamp = event.block.timestamp
  swap.blockNumber = event.block.number
  swap.pool = event.address
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
