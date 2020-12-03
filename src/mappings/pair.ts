import {
  Approval,
  LendingPair as LendingPairContract,
  LogAddAsset,
  LogAddBorrow,
  LogAddCollateral,
  LogExchangeRate,
  LogInterestRate,
  LogRemoveAsset,
  LogRemoveBorrow,
  LogRemoveCollateral,
  OwnershipTransferred,
  Transfer,
} from '../../generated/templates/LendingPair/LendingPair'

import { LendingPair } from '../../generated/schema'
import { getUser } from './helpers/getUser'
import { getUserLendingPairData } from './helpers/getUserLendingPairData'
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
    event.params.share.toString(),
    event.params.user.toHex(),
  ])

  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalSupply = lendingPair.totalSupply.plus(event.params.fraction)
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.plus(event.params.share)
  lendingPair.save()

  const user = getUser(event.params.user, event.block)
  const userData = getUserLendingPairData(event.params.user, event.address)
  userData.balanceOf = userData.balanceOf.plus(event.params.fraction)
  userData.save()
}

export function handleLogAddBorrow(event: LogAddBorrow): void {
  log.info('[BentoBox:LendingPair] Log Add Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.plus(event.params.fraction)
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.plus(event.params.share)
  lendingPair.save()
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
  log.info('[BentoBox:LendingPair] Log Add Collateral {} {}', [
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.plus(event.params.share)
  lendingPair.save()

  const user = getUser(event.params.user, event.block)
  const userData = getUserLendingPairData(event.params.user, event.address)
  userData.userCollateralShare = userData.userCollateralShare.plus(event.params.share)
  userData.save()
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
  log.info('[BentoBox:LendingPair] Log Exchange Rate {}', [event.params.rate.toString()])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.exchangeRate = lendingPair.exchangeRate.plus(event.params.rate)
  lendingPair.save()
}

export function handleLogRemoveAsset(event: LogRemoveAsset): void {
  log.info('[BentoBox:LendingPair] Log Remove Asset {} {} {}', [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalSupply = lendingPair.totalSupply.minus(event.params.fraction)
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.minus(event.params.share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.balanceOf = user.balanceOf.minus(event.params.fraction)
  user.save()
}

export function handleLogRemoveBorrow(event: LogRemoveBorrow): void {
  log.info('[BentoBox:LendingPair] Log Remove Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.minus(event.params.fraction)
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.minus(event.params.share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.userBorrowFraction = user.userBorrowFraction.minus(event.params.fraction)
  user.save()
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info('[BentoBox:LendingPair] Log Remove Collateral {} {}', [
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.minus(event.params.share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.userCollateralShare = user.userCollateralShare.minus(event.params.share)
  user.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.info('[BentoBox:LendingPair] Ownership Transfered {} {}', [
    event.params.newOwner.toHex(),
    event.params.previousOwner.toHex(),
  ])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.owner = event.params.newOwner
  lendingPair.save()
}

export function handleTransfer(event: Transfer): void {
  log.info('[BentoBox:LendingPair] Transfer {} {}', [
    event.params._from.toHex(),
    event.params._to.toHex(),
    event.params._value.toString(),
  ])
  const sender = getUserLendingPairData(event.params._from, event.address)
  sender.balanceOf = sender.balanceOf.minus(event.params._value)
  sender.save()

  const user = getUser(event.params._to, event.block)
  const receiver = getUserLendingPairData(event.params._to, event.address)
  receiver.balanceOf = receiver.balanceOf.plus(event.params._value)
  receiver.save()
}

export function handleLogInterestRate(event: LogInterestRate): void {
  log.info('[BentoBox:LendingPair] Log Interest Rate {}', [event.params.rate.toString()])
  const lendingPair = LendingPair.load(event.address.toHex())
  lendingPair.interestPerBlock = event.params.rate
  // I assume this will change soon based on discussions
  if (event.params.utilization) {
    lendingPair.utilization = event.params.utilization
  }
  lendingPair.save()
}
