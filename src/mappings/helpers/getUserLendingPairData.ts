import { Address } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from './constants'
import { UserLendingPairData } from '../../../generated/schema'

export function getUserLendingPairData(user: Address, pair: Address): UserLendingPairData {
  const uid = user.toHex()
  const pid = pair.toHex()
  const id = getUserLendingPairDataId(user, pair)
  let userLendingPairData = UserLendingPairData.load(id)

  if (userLendingPairData === null) {
    userLendingPairData = new UserLendingPairData(id)
    userLendingPairData.owner = uid
    userLendingPairData.lendingPair = pid
    userLendingPairData.userCollateralAmount = BIG_INT_ZERO
    userLendingPairData.balanceOf = BIG_INT_ZERO
    userLendingPairData.userBorrowFraction = BIG_INT_ZERO
    userLendingPairData.save()
  }

  return userLendingPairData as UserLendingPairData
}

export function getUserLendingPairDataId(user: Address, pair: Address): string {
  const uid = user.toHex()
  const pid = pair.toHex()
  return uid.concat('-').concat(pid)
}
