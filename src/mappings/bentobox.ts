import { BENTOBOX_DEPOSIT, BENTOBOX_MEDIUM_RISK_PAIR, BENTOBOX_TRANSFER, BENTOBOX_WITHDRAW } from '../constants'
import {
  LogDeploy,
  LogDeposit,
  LogSetMasterContractApproval,
  LogTransfer,
  LogWithdraw,
} from '../../generated/BentoBox/BentoBox'
import { Token, User } from '../../generated/schema'
import {
  createPair,
  getMasterContractApproval,
  getToken,
  getUser,
  getUserToken,
  incrementLendingPairsCount,
} from '../entities'

import { Pair as PairTemplate } from '../../generated/templates'
import { createBentoBoxAction } from '../entities/bentobox-action'
import { log } from '@graphprotocol/graph-ts'

export function handleLogDeploy(event: LogDeploy): void {
  log.info('[BentoBox] Log Deploy {} {} {}', [
    event.params.cloneAddress.toHex(),
    event.params.data.toHex(),
    event.params.masterContract.toHex(),
  ])

  if (event.params.masterContract == BENTOBOX_MEDIUM_RISK_PAIR) {
    createPair(event.params.cloneAddress, event.block)

    incrementLendingPairsCount()

    PairTemplate.create(event.params.cloneAddress)
  }
}

export function handleLogDeposit(event: LogDeposit): void {
  log.info('[BentoBox] Log Deposit {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])

  const token = getToken(event.params.token, event.block)
  token.totalSupply = token.totalSupply.plus(event.params.amount)
  token.save()

  const userTokenData = getUserToken(getUser(event.params.to, event.block) as User, token as Token)
  userTokenData.amount = userTokenData.amount.plus(event.params.amount)
  userTokenData.save()

  createBentoBoxAction(event, BENTOBOX_DEPOSIT)
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
  log.info('[BentoBox] Log Transfer {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])

  const token = getToken(event.params.token, event.block)

  const sender = getUserToken(getUser(event.params.from, event.block) as User, token as Token)
  sender.amount = sender.amount.minus(event.params.amount)
  sender.save()

  const receiver = getUserToken(getUser(event.params.to, event.block) as User, token as Token)
  receiver.amount = receiver.amount.plus(event.params.amount)
  receiver.save()

  createBentoBoxAction(event, BENTOBOX_TRANSFER)
}

export function handleLogWithdraw(event: LogWithdraw): void {
  log.info('[BentoBox] Log Withdraw {} {} {} {}', [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ])

  //const tid = event.params.token.toHex()
  const token = getToken(event.params.token, event.block)
  token.totalSupply = token.totalSupply.minus(event.params.amount)
  token.save()

  const sender = getUserToken(getUser(event.params.from, event.block) as User, token as Token)
  sender.amount = sender.amount.minus(event.params.amount)
  sender.save()

  createBentoBoxAction(event, BENTOBOX_WITHDRAW)
}
