import { BIG_INT_ONE, BIG_INT_ZERO, MEDIUM_RISK_LENDING_PAIR_MASTER } from './helpers/constants'
import { BentoBox, LendingPair, Token, Deposit, Withdrawal } from '../../generated/schema'
import {
  BentoBox as BentoBoxContract,
  LogDeploy,
  LogDeposit,
  LogSetMasterContractApproval,
  LogTransfer,
  LogWithdraw,
} from '../../generated/BentoBox/BentoBox'
import { dataSource, log } from '@graphprotocol/graph-ts'

import { LendingPair as LendingPairContract } from '../../generated/BentoBox/LendingPair'
import { LendingPair as LendingPairTemplate } from '../../generated/templates'
import { getMasterContractApproval } from './helpers/getMasterContractApproval'
import { getUser } from './helpers/getUser'
import { getUniqueId } from './helpers/utils'
import { getUserBentoTokenData } from './helpers/getUserBentoTokenData'

export function handleLogDeploy(event: LogDeploy): void {
  log.info('[BentoBox] Log Deploy {} {} {}', [
    event.params.clone_address.toHex(),
    event.params.data.toHex(),
    event.params.masterContract.toHex(),
  ])

  let bentoBox = BentoBox.load(dataSource.address().toHex())

  if (bentoBox == null) {
    const bentoBoxContract = BentoBoxContract.bind(dataSource.address())
    bentoBox = new BentoBox(dataSource.address().toHex())
    bentoBox.WETH = bentoBoxContract.WETH()
    bentoBox.lendingPairsCount = BIG_INT_ZERO
  }

  bentoBox.lendingPairsCount = bentoBox.lendingPairsCount.plus(BIG_INT_ONE)

  bentoBox.save()

  // Already initilised
  if (LendingPair.load(event.params.clone_address.toHex())) {
    return
  }

  if (event.params.masterContract == MEDIUM_RISK_LENDING_PAIR_MASTER) {
    // Bind to contract for easy data access on creation
    const lendingPairContract = LendingPairContract.bind(event.params.clone_address)

    const lendingPair = new LendingPair(event.params.clone_address.toHex())

    lendingPair.asset = lendingPairContract.asset()
    lendingPair.bentoBox = bentoBox.id
    lendingPair.borrowOpeningFee = lendingPairContract.borrowOpeningFee()
    lendingPair.closedCollaterizationRate = lendingPairContract.closedCollaterizationRate()
    lendingPair.collateral = lendingPairContract.collateral()
    lendingPair.decimals = lendingPairContract.decimals()
    lendingPair.dev = lendingPairContract.dev()
    lendingPair.devFee = lendingPairContract.devFee()
    lendingPair.exchangeRate = lendingPairContract.exchangeRate()
    lendingPair.feeTo = lendingPairContract.feeTo()
    lendingPair.feesPendingAmount = BIG_INT_ZERO
    lendingPair.interestElasticity = lendingPairContract.interestElasticity()
    lendingPair.lastBlockAccrued = BIG_INT_ZERO
    lendingPair.liquidationMultiplier = lendingPairContract.liquidationMultiplier()
    lendingPair.masterContract = lendingPairContract.masterContract()
    lendingPair.maximumInterestPerBlock = lendingPairContract.maximumInterestPerBlock()
    lendingPair.maximumTargetUtilization = lendingPairContract.maximumTargetUtilization()
    lendingPair.minimumInterestPerBlock = lendingPairContract.minimumInterestPerBlock()
    lendingPair.interestPerBlock = lendingPair.minimumInterestPerBlock
    lendingPair.minimumTargetUtilization = lendingPairContract.minimumTargetUtilization()
    lendingPair.name = lendingPairContract.name()
    lendingPair.openCollaterizationRate = lendingPairContract.openCollaterizationRate()
    lendingPair.oracle = lendingPairContract.oracle()
    lendingPair.owner = lendingPairContract.owner()
    lendingPair.pendingOwner = lendingPairContract.pendingOwner()
    lendingPair.protocolFee = lendingPairContract.protocolFee()
    lendingPair.startingInterestPerBlock = lendingPairContract.startingInterestPerBlock()
    lendingPair.symbol = lendingPairContract.symbol()
    lendingPair.totalAssetAmount = BIG_INT_ZERO
    lendingPair.totalAssetFraction = BIG_INT_ZERO
    lendingPair.totalBorrowFraction = BIG_INT_ZERO
    lendingPair.totalBorrowAmount = BIG_INT_ZERO
    lendingPair.totalCollateralAmount = BIG_INT_ZERO
    lendingPair.utilization = BIG_INT_ZERO
    lendingPair.block = event.block.number
    lendingPair.timestamp = event.block.timestamp

    lendingPair.save()

    LendingPairTemplate.create(event.params.clone_address)
  }
}

export function handleLogDeposit(event: LogDeposit): void {
  log.info('[BentoBox] Log Deposit {} {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])
  const tid = event.params.token.toHex()

  const bentoAddress = event.address.toHex()

  let token = Token.load(tid)

  if (token == null) {
    token = new Token(event.params.token.toHex())
    token.bentoBox = bentoAddress
    token.totalSupply = BIG_INT_ZERO
    token.block = event.block.number
    token.timestamp = event.block.timestamp
  }

  token.totalSupply = token.totalSupply.plus(event.params.amount)
  token.save()

  getUser(event.params.to, event.block)
  const userTokenData = getUserBentoTokenData(event.params.to, event.params.token)
  userTokenData.amount = userTokenData.amount.plus(event.params.amount)
  userTokenData.save()

  const deposit = new Deposit(getUniqueId(event))
  deposit.bentoBox = event.address.toHex()
  deposit.from = event.params.from.toHex()
  deposit.to = event.params.to.toHex()
  deposit.token = tid
  deposit.amount = event.params.amount
  deposit.amount = event.params.amount
  deposit.block = event.block.number
  deposit.timestamp = event.block.timestamp
  deposit.save()
}

export function handleLogSetMasterContractApproval(event: LogSetMasterContractApproval): void {
  log.info('[BentoBox] Log Set Master Contract Approval {} {} {}', [
    event.params.approved == true ? 'true' : 'false',
    event.params.masterContract.toHex(),
    event.params.user.toHex(),
  ])
  getUser(event.params.user, event.block)
  const masterContractApproval = getMasterContractApproval(event.params.user, event.params.masterContract)
  masterContractApproval.approved = event.params.approved
  masterContractApproval.save()
}

export function handleLogTransfer(event: LogTransfer): void {
  log.info('[BentoBox] Log Transfer {} {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])

  const sender = getUserBentoTokenData(event.params.from, event.params.token)
  sender.amount = sender.amount.minus(event.params.amount)
  sender.save()

  getUser(event.params.to, event.block)
  const receiver = getUserBentoTokenData(event.params.to, event.params.token)
  receiver.amount = receiver.amount.plus(event.params.amount)
  receiver.save()
}

export function handleLogWithdraw(event: LogWithdraw): void {
  log.info('[BentoBox] Log Withdraw {} {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])
  const tid = event.params.token.toHex()

  const withdrawal = new Withdrawal(getUniqueId(event))
  withdrawal.bentoBox = event.address.toHex()
  withdrawal.from = event.params.from.toHex()
  withdrawal.to = event.params.to
  withdrawal.token = tid
  withdrawal.amount = event.params.amount
  withdrawal.block = event.block.number
  withdrawal.timestamp = event.block.timestamp
  withdrawal.save()

  const token = Token.load(tid)
  token.totalSupply = token.totalSupply.minus(event.params.amount)
  token.save()

  const sender = getUserBentoTokenData(event.params.from, event.params.token)
  sender.amount = sender.amount.minus(event.params.amount)
  sender.save()
}
