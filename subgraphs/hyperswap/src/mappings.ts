import { BigInt, BigDecimal, Address, dataSource } from "@graphprotocol/graph-ts"
import { 
  PoolCreated as PoolCreatedEvent 
} from "../generated/Factory/Factory"
import { 
  Swap as SwapEvent,
  Initialize as InitializeEvent
} from "../generated/templates/Pool/Pool"
import { Pool as PoolTemplate } from "../generated/templates"
import { Factory, Pool, Token, Swap } from "../generated/schema"

export const ZERO_BI = BigInt.fromI32(0)
export const ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = BigDecimal.fromString('0')
export const ONE_BD = BigDecimal.fromString('1')
export const BI_18 = BigInt.fromI32(18)

export function handlePoolCreated(event: PoolCreatedEvent): void {
 
  let factory = Factory.load(event.address.toHexString())
  if (factory === null) {
    factory = new Factory(event.address.toHexString())
    factory.poolCount = ZERO_BI
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI)
  factory.save()

  let token0 = Token.load(event.params.token0.toHexString())
  if (token0 === null) {
    token0 = new Token(event.params.token0.toHexString())
    token0.decimals = BI_18
    token0.save()
  }

  let token1 = Token.load(event.params.token1.toHexString())
  if (token1 === null) {
    token1 = new Token(event.params.token1.toHexString())
    token1.decimals = BI_18
    token1.save()
  }

  let pool = new Pool(event.params.pool.toHexString())
  pool.factory = factory.id
  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.fee = BigInt.fromI32(event.params.fee)
  pool.tickSpacing = BigInt.fromI32(event.params.tickSpacing)
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.tick = ZERO_BI
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.swapCount = ZERO_BI
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number
  pool.save()

  PoolTemplate.create(event.params.pool)
}

export function handleInitialize(event: InitializeEvent): void {
  let pool = Pool.load(event.address.toHexString())
  if (pool !== null) {
    pool.sqrtPrice = event.params.sqrtPriceX96
    pool.tick = BigInt.fromI32(event.params.tick)
    pool.save()
  }
}

export function handleSwap(event: SwapEvent): void {
  let poolAddress = event.address.toHexString()
  
  let pool = Pool.load(poolAddress)
  if (pool === null) {
    return 
  }
  
  pool.swapCount = pool.swapCount.plus(ONE_BI)
  pool.volumeToken0 = pool.volumeToken0.plus(event.params.amount0.abs().toBigDecimal())
  pool.volumeToken1 = pool.volumeToken1.plus(event.params.amount1.abs().toBigDecimal())
  pool.liquidity = event.params.liquidity
  pool.sqrtPrice = event.params.sqrtPriceX96
  pool.tick = BigInt.fromI32(event.params.tick)
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
  if (receipt !== null) {
    swap.gasUsed = receipt.gasUsed
  } else {
    swap.gasUsed = ZERO_BI
  }
  
  swap.gasPrice = event.transaction.gasPrice
  
  
  swap.save()
}