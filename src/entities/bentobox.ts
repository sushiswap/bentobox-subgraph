import { BIG_INT_ONE, BIG_INT_ZERO } from '../constants'

import { BentoBox } from '../../generated/schema'
import { BentoBox as BentoBoxContract } from '../../generated/BentoBox/BentoBox'
import { dataSource } from '@graphprotocol/graph-ts'

export function getBentoBox(): BentoBox {
  let bentoBox = BentoBox.load(dataSource.address().toHex())

  if (bentoBox == null) {
    const bentoBoxContract = BentoBoxContract.bind(dataSource.address())
    bentoBox = new BentoBox(dataSource.address().toHex())
    bentoBox.WethToken = bentoBoxContract.WethToken()
    bentoBox.lendingPairsCount = BIG_INT_ZERO
  }

  return bentoBox as BentoBox
}

export function incrementLendingPairsCount(): void {
  const bentoBox = getBentoBox()
  bentoBox.lendingPairsCount = bentoBox.lendingPairsCount.plus(BIG_INT_ONE)
  bentoBox.save()
}
