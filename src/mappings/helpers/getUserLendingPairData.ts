import { Address } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from './constants'
import { UserLendingPairData } from '../../../generated/schema'

export function getUserLendingPairData(user: Address, pair: Address): UserLendingPairData {
  const uid = user.toHex()
  const pid = pair.toHex()
  const id = uid.concat('-').concat(pid)

  let userLendingPairData = UserLendingPairData.load(uid)

  if (userLendingPairData === null) {
    userLendingPairData = new UserLendingPairData(id)
    userLendingPairData.owner = uid
    userLendingPairData.lendingPair = pid
    userLendingPairData.userCollateralShare = BIG_INT_ZERO
    userLendingPairData.balanceOf = BIG_INT_ZERO
    userLendingPairData.userBorrowFraction = BIG_INT_ZERO
    userLendingPairData.save()
  }

  return userLendingPairData as UserLendingPairData
}
