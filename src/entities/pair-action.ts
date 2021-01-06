import { PairAction } from '../../generated/schema'
import { ethereum } from '@graphprotocol/graph-ts'
import { getPair } from './pair'

export function createPairAction(event: ethereum.Event, type: string): PairAction {
  const id = event.transaction.hash.toHex() + '-' + event.logIndex.toString()

  const userAddress = event.parameters[0].value.toAddress().toHex()
  const pairAddress = event.address.toHex()

  const root = userAddress.concat('-').concat(pairAddress)

  const lendingPair = getPair(event.address, event.block)

  const action = new PairAction(id)

  action.root = root
  action.type = type
  action.pair = event.address.toHex()
  action.amount = event.parameters[1].value.toBigInt()
  action.fraction = event.parameters.length === 3 ? event.parameters[2].value.toBigInt() : null
  action.token = lendingPair.asset
  action.block = event.block.number
  action.timestamp = event.block.timestamp

  return action as PairAction
}
