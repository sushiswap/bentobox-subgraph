import { ethereum } from '@graphprotocol/graph-ts'

export const getUniqueId = (event: ethereum.Event): string => {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString()
}
