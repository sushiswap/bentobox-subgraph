import {
  Approval,
  LogAccrue,
  LogAddAsset,
  LogAddBorrow,
  LogAddCollateral,
  LogDev,
  LogExchangeRate,
  LogFeeTo,
  LogRemoveAsset,
  LogRemoveBorrow,
  LogRemoveCollateral,
  LogWithdrawFees,
  OwnershipTransferred,
  Transfer,
} from '../../generated/templates/LendingPair/LendingPair'
import {
  PAIR_ADD_ASSET,
  PAIR_ADD_BORROW,
  PAIR_ADD_COLLATERAL,
  PAIR_REMOVE_ASSET,
  PAIR_REMOVE_BORROW,
  PAIR_REMOVE_COLLATERAL,
} from '../constants'
import { getPair, getUser, getUserPair } from '../entities'

import { createPairAction } from '../entities/pair-action'
import { log } from '@graphprotocol/graph-ts'

export function handleApproval(event: Approval): void {
  log.info('[BentoBox:LendingPair] Approval {} {} {}', [
    event.params._owner.toHex(),
    event.params._spender.toHex(),
    event.params._value.toString(),
  ])
}

export function handleLogAddAsset(event: LogAddAsset): void {
  log.info('[BentoBox:LendingPair] Log Add Asset {} {} {}', [
    event.params.fraction.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])

  const amount = event.params.amount
  const fraction = event.params.fraction

  const pair = getPair(event.address, event.block)
  pair.totalAssetAmount = pair.totalAssetAmount.plus(amount)
  pair.totalAssetFraction = pair.totalAssetFraction.plus(fraction)
  pair.save()

  getUser(event.params.user, event.block)
  const userData = getUserPair(event.params.user, event.address)
  userData.balanceOf = userData.balanceOf.plus(fraction)
  userData.save()

  const action = createPairAction(event, PAIR_ADD_ASSET)
  action.poolPercentage = fraction.div(pair.totalAssetFraction)
  action.save()
}

export function handleLogAddBorrow(event: LogAddBorrow): void {
  log.info('[BentoBox:LendingPair] Log Add Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])
  const amount = event.params.amount
  const fraction = event.params.fraction

  const pair = getPair(event.address, event.block)
  pair.totalBorrowFraction = pair.totalBorrowFraction.plus(fraction)
  pair.totalBorrowAmount = pair.totalBorrowAmount.plus(amount)
  pair.save()

  const user = getUserPair(event.params.user, event.address)
  user.userBorrowFraction = user.userBorrowFraction.plus(fraction)
  user.save()

  const action = createPairAction(event, PAIR_ADD_BORROW)
  action.poolPercentage = fraction.div(pair.totalBorrowFraction)
  action.save()
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
  log.info('[BentoBox:LendingPair] Log Add Collateral {} {}', [
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])

  const amount = event.params.amount

  const pair = getPair(event.address, event.block)
  pair.totalCollateralAmount = pair.totalCollateralAmount.plus(amount)
  pair.save()

  getUser(event.params.user, event.block)
  const userData = getUserPair(event.params.user, event.address)
  userData.userCollateralAmount = userData.userCollateralAmount.plus(amount)
  userData.save()

  //const test_collateral = pair.collateral as Token
  log.info('pair-id: {}, collateral: {}', [event.address.toHex(), pair.collateral])

  const action = createPairAction(event, PAIR_ADD_COLLATERAL)
  action.poolPercentage = amount.div(pair.totalCollateralAmount)
  action.save()
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
  log.info('[BentoBox:LendingPair] Log Exchange Rate {}', [event.params.rate.toString()])
  const pair = getPair(event.address, event.block)
  pair.exchangeRate = pair.exchangeRate.plus(event.params.rate)
  pair.save()
}

export function handleLogRemoveAsset(event: LogRemoveAsset): void {
  log.info('[BentoBox:LendingPair] Log Remove Asset {} {} {}', [
    event.params.fraction.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])
  const fraction = event.params.fraction
  const amount = event.params.amount

  const pair = getPair(event.address, event.block)

  const poolPercentage = fraction.div(pair.totalAssetFraction)

  pair.totalAssetFraction = pair.totalAssetFraction.minus(fraction)
  pair.totalAssetAmount = pair.totalAssetAmount.minus(amount)
  pair.save()

  const user = getUserPair(event.params.user, event.address)
  user.balanceOf = user.balanceOf.minus(fraction)
  user.save()

  const action = createPairAction(event, PAIR_REMOVE_ASSET)
  action.poolPercentage = poolPercentage
  action.save()
}

export function handleLogRemoveBorrow(event: LogRemoveBorrow): void {
  log.info('[BentoBox:LendingPair] Log Remove Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])
  const amount = event.params.amount
  const fraction = event.params.fraction

  const pair = getPair(event.address, event.block)

  const poolPercentage = fraction.div(pair.totalBorrowFraction)

  pair.totalBorrowFraction = pair.totalBorrowFraction.minus(fraction)
  pair.totalBorrowAmount = pair.totalBorrowAmount.minus(amount)
  pair.save()

  const user = getUserPair(event.params.user, event.address)
  user.userBorrowFraction = user.userBorrowFraction.minus(fraction)
  user.save()

  const action = createPairAction(event, PAIR_REMOVE_BORROW)
  action.poolPercentage = poolPercentage
  action.save()
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info('[BentoBox:LendingPair] Log Remove Collateral {} {}', [
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])
  const amount = event.params.amount

  const pair = getPair(event.address, event.block)

  const poolPercentage = amount.div(pair.totalCollateralAmount)

  pair.totalCollateralAmount = pair.totalCollateralAmount.minus(amount)
  pair.save()

  const user = getUserPair(event.params.user, event.address)
  user.userCollateralAmount = user.userCollateralAmount.minus(amount)
  user.save()

  const action = createPairAction(event, PAIR_REMOVE_COLLATERAL)
  action.poolPercentage = poolPercentage
  action.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.info('[BentoBox:LendingPair] Ownership Transfered {} {}', [
    event.params.newOwner.toHex(),
    event.params.previousOwner.toHex(),
  ])

  const pair = getPair(event.address, event.block)
  pair.owner = event.params.newOwner
  pair.save()
}

export function handleTransfer(event: Transfer): void {
  log.info('[BentoBox:LendingPair] Transfer {} {}', [
    event.params._from.toHex(),
    event.params._to.toHex(),
    event.params._value.toString(),
  ])
  const sender = getUserPair(event.params._from, event.address)
  sender.balanceOf = sender.balanceOf.minus(event.params._value)
  sender.save()

  const user = getUser(event.params._to, event.block)
  const receiver = getUserPair(event.params._to, event.address)
  receiver.balanceOf = receiver.balanceOf.plus(event.params._value)
  receiver.save()
}

export function handleLogAccrue(event: LogAccrue): void {
  log.info('[BentoBox:LendingPair] Log Accrue {} {} {} {}', [
    event.params.accruedAmount.toString(),
    event.params.feeAmount.toString(),
    event.params.rate.toString(),
    event.params.utilization.toString(),
  ])
  const pair = getPair(event.address, event.block)
  const extraAmount = event.params.accruedAmount
  const feeAmount = event.params.feeAmount
  pair.totalAssetAmount = pair.totalAssetAmount.plus(extraAmount.minus(feeAmount))
  pair.totalBorrowAmount = pair.totalBorrowAmount.plus(extraAmount)
  pair.feesPendingAmount = pair.feesPendingAmount.plus(feeAmount)
  pair.interestPerBlock = event.params.rate
  pair.utilization = event.params.utilization
  pair.lastBlockAccrued = event.block.number
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

export function handleLogFeeTo(event: LogFeeTo): void {
  const pair = getPair(event.address, event.block)
  pair.feeTo = event.params.newFeeTo
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

export function handleLogDev(event: LogDev): void {
  const pair = getPair(event.address, event.block)
  pair.dev = event.params.newDev
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}

export function handleLogWithdrawFees(event: LogWithdrawFees): void {
  const pair = getPair(event.address, event.block)
  //pair.feesPendingAmount = event.params.feesPendingAmount
  pair.block = event.block.number
  pair.timestamp = event.block.timestamp
  pair.save()
}
