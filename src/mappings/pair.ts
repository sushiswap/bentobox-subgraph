import {
  Approval,
  LendingPair as LendingPairContract,
  LogAddAsset,
  LogAccrue,
  LogAddBorrow,
  LogAddCollateral,
  LogExchangeRate,
  LogRemoveAsset,
  LogRemoveBorrow,
  LogRemoveCollateral,
  OwnershipTransferred,
  Transfer,
} from '../../generated/templates/LendingPair/LendingPair'

import { LendingPair, Token, PairTx } from '../../generated/schema'
import { getUser } from './helpers/getUser'
import { getUniqueId } from './helpers/utils'
import {BIG_INT_MINUS_ONE} from './helpers/constants'
import { getUserLendingPairData, getUserLendingPairDataId } from './helpers/getUserLendingPairData'
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
  const share = event.params.share
  const fraction = event.params.fraction
  const lid = event.address.toHex()

  const lendingPair = LendingPair.load(lid)
  lendingPair.totalSupply = lendingPair.totalSupply.plus(fraction)
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.plus(share)
  lendingPair.save()

  const user = getUser(event.params.user, event.block)
  const userData = getUserLendingPairData(event.params.user, event.address)
  userData.balanceOf = userData.balanceOf.plus(fraction)
  userData.save()

  const tid = lendingPair.asset.toHex()
  const asset = Token.load(tid)
  const assetTx = new PairTx(getUniqueId(event))
  assetTx.root = getUserLendingPairDataId(event.params.user, event.address)
  assetTx.amount = asset.totalAmount.times(share.div(asset.totalShare))
  assetTx.type = "assetTx"
  assetTx.lendingPair = lid
  assetTx.token = tid
  assetTx.fraction = fraction
  assetTx.share = share
  assetTx.poolPercentage = fraction.div(lendingPair.totalSupply)
  assetTx.block = event.block.number
  assetTx.timestamp = event.block.timestamp
  assetTx.save()
}

export function handleLogAddBorrow(event: LogAddBorrow): void {
  log.info('[BentoBox:LendingPair] Log Add Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const share = event.params.share
  const fraction = event.params.fraction
  const lid = event.address.toHex()

  const lendingPair = LendingPair.load(lid)
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.plus(fraction)
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.plus(share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.userBorrowFraction = user.userBorrowFraction.plus(fraction)
  user.save()

  const tid = lendingPair.asset.toHex()
  const asset = Token.load(tid)
  const borrowTx = new PairTx(getUniqueId(event))
  borrowTx.type = "borrowTx"
  borrowTx.root = getUserLendingPairDataId(event.params.user, event.address)
  borrowTx.amount = asset.totalAmount.times(share.div(asset.totalShare))
  borrowTx.lendingPair = lid
  borrowTx.token = tid
  borrowTx.fraction = fraction
  borrowTx.share = share
  borrowTx.poolPercentage = fraction.div(lendingPair.totalBorrowFraction)
  borrowTx.block = event.block.number
  borrowTx.timestamp = event.block.timestamp
  borrowTx.save()
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
  log.info('[BentoBox:LendingPair] Log Add Collateral {} {}', [
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const share = event.params.share
  const lid = event.address.toHex()
  const lendingPair = LendingPair.load(lid)
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.plus(share)
  lendingPair.save()

  const user = getUser(event.params.user, event.block)
  const userData = getUserLendingPairData(event.params.user, event.address)
  userData.userCollateralShare = userData.userCollateralShare.plus(share)
  userData.save()

  const tid = lendingPair.collateral.toHex()
  const collateral = Token.load(tid)
  const collateralTx = new PairTx(getUniqueId(event))
  collateralTx.type = "collateralTx"
  collateralTx.root = getUserLendingPairDataId(event.params.user, event.address)
  collateralTx.lendingPair = lid
  collateralTx.token = tid
  collateralTx.share = share
  collateralTx.amount = collateral.totalAmount.times(share.div(collateral.totalShare))
  collateralTx.poolPercentage = share.div(lendingPair.totalCollateralShare)
  collateralTx.block = event.block.number
  collateralTx.timestamp = event.block.timestamp
  collateralTx.save()
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
  const fraction = event.params.fraction
  const share = event.params.share
  const lid = event.address.toHex()

  const lendingPair = LendingPair.load(lid)
  lendingPair.totalSupply = lendingPair.totalSupply.minus(fraction)
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.minus(share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.balanceOf = user.balanceOf.minus(fraction)
  user.save()

  const tid = lendingPair.asset.toHex()
  const asset = Token.load(tid)
  const assetTx = new PairTx(getUniqueId(event))
  assetTx.type = "assetTx"
  assetTx.root = getUserLendingPairDataId(event.params.user, event.address)
  assetTx.lendingPair = lid
  assetTx.token = tid
  assetTx.amount = asset.totalAmount.times(share.div(asset.totalShare)).times(BIG_INT_MINUS_ONE)
  assetTx.fraction = fraction
  assetTx.share = share
  assetTx.poolPercentage = fraction.div(lendingPair.totalSupply)
  assetTx.block = event.block.number
  assetTx.timestamp = event.block.timestamp
  assetTx.save()
}

export function handleLogRemoveBorrow(event: LogRemoveBorrow): void {
  log.info('[BentoBox:LendingPair] Log Remove Borrow {} {} {}', [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const share = event.params.share
  const fraction = event.params.fraction
  const lid = event.address.toHex()

  const lendingPair = LendingPair.load(lid)
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.minus(fraction)
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.minus(share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.userBorrowFraction = user.userBorrowFraction.minus(fraction)
  user.save()

  const tid = lendingPair.asset.toHex()
  const asset = Token.load(tid)
  const borrowTx = new PairTx(getUniqueId(event))
  borrowTx.type = "borrowTx"
  borrowTx.root = getUserLendingPairDataId(event.params.user, event.address)
  borrowTx.lendingPair = lid
  borrowTx.token = tid
  borrowTx.amount = asset.totalAmount.times(share.div(asset.totalShare)).times(BIG_INT_MINUS_ONE)
  borrowTx.fraction = fraction
  borrowTx.share = share
  borrowTx.poolPercentage = fraction.div(lendingPair.totalBorrowFraction)
  borrowTx.block = event.block.number
  borrowTx.timestamp = event.block.timestamp
  borrowTx.save()
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info('[BentoBox:LendingPair] Log Remove Collateral {} {}', [
    event.params.share.toString(),
    event.params.user.toHex(),
  ])
  const share = event.params.share
  const lid = event.address.toHex()

  const lendingPair = LendingPair.load(lid)
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.minus(share)
  lendingPair.save()

  const user = getUserLendingPairData(event.params.user, event.address)
  user.userCollateralShare = user.userCollateralShare.minus(share)
  user.save()

  const tid = lendingPair.collateral.toHex()
  const collateral = Token.load(tid)
  const collateralTx = new PairTx(getUniqueId(event))
  collateralTx.type = "collateralTx"
  collateralTx.root = getUserLendingPairDataId(event.params.user, event.address)
  collateralTx.lendingPair = lid
  collateralTx.token = tid
  collateralTx.amount = collateral.totalAmount.times(share.div(collateral.totalShare)).times(BIG_INT_MINUS_ONE)
  collateralTx.share = share
  collateralTx.poolPercentage = share.div(lendingPair.totalCollateralShare)
  collateralTx.block = event.block.number
  collateralTx.timestamp = event.block.timestamp
  collateralTx.save()
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

export function handleLogAccrue(event: LogAccrue): void {
  log.info('[BentoBox:LendingPair] Log Accrue {} {} {} {}', [event.params.shareAccrued.toString(), event.params.shareFee.toString(), event.params.rate.toString(), event.params.utilization.toString()])
  const lendingPair = LendingPair.load(event.address.toHex())
  const extraShare = event.params.shareAccrued
  const feeShare = event.params.shareFee
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.plus(extraShare.minus(feeShare))
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.plus(extraShare)
  lendingPair.feesPendingShare = lendingPair.feesPendingShare.plus(feeShare)
  lendingPair.interestPerBlock = event.params.rate
  lendingPair.utilization = event.params.utilization
  lendingPair.block = event.block.number
  lendingPair.timestamp = event.block.timestamp
  lendingPair.save()
}
