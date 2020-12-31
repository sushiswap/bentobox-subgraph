import { Address, ethereum } from '@graphprotocol/graph-ts'

import { BIG_INT_ZERO } from '../constants'
import { Pair } from '../../generated/schema'
import { Pair as PairContract } from '../../generated/BentoBox/Pair'
import { createToken } from './token'
import { getBentoBox } from './bentobox'

export function createPair(address: Address, block: ethereum.Block): Pair {
  const bentoBox = getBentoBox()

  // Bind to contract for easy data access on creation
  const pairContract = PairContract.bind(address)

  const pair = new Pair(address.toHex())

  const asset = createToken(pairContract.asset(), block)

  const collateral = createToken(pairContract.collateral(), block)

  pair.asset = asset.id
  pair.bentoBox = bentoBox.id
  pair.collateral = collateral.id
  pair.decimals = pairContract.decimals()
  pair.dev = pairContract.dev()
  pair.exchangeRate = pairContract.exchangeRate()
  pair.feeTo = pairContract.feeTo()
  pair.feesPendingAmount = BIG_INT_ZERO
  pair.interestPerBlock = BIG_INT_ZERO
  pair.lastBlockAccrued = BIG_INT_ZERO
  pair.masterContract = pairContract.masterContract()
  pair.name = pairContract.name()
  pair.oracle = pairContract.oracle()
  pair.owner = pairContract.owner()
  pair.pendingOwner = pairContract.pendingOwner()
  pair.symbol = pairContract.symbol()
  pair.totalAssetAmount = BIG_INT_ZERO
  pair.totalAssetFraction = BIG_INT_ZERO
  pair.totalBorrowFraction = BIG_INT_ZERO
  pair.totalBorrowAmount = BIG_INT_ZERO
  pair.totalCollateralAmount = BIG_INT_ZERO
  pair.utilization = BIG_INT_ZERO
  pair.block = block.number
  pair.timestamp = block.timestamp

  return pair as Pair
}

export function getPair(address: Address, block: ethereum.Block): Pair {
  const id = address.toHex()
  let pair = Pair.load(id)
  if (pair === null) {
    pair = createPair(address, block)
  }
  return pair as Pair
}
