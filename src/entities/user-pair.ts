import { Address } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from '../constants'
import { UserPair } from '../../generated/schema'

export function createUserPair(user: Address, pair: Address): UserPair {
  const id = getUserPairId(user, pair)

  const userPair = new UserPair(id)

  userPair.user = user.toHex()
  userPair.pair = pair.toHex()
  userPair.userCollateralAmount = BIG_INT_ZERO
  userPair.balanceOf = BIG_INT_ZERO
  userPair.userBorrowFraction = BIG_INT_ZERO
  userPair.save()

  return userPair as UserPair
}

export function getUserPair(user: Address, pair: Address): UserPair {
  let userLendingPairData = UserPair.load(getUserPairId(user, pair))

  if (userLendingPairData === null) {
    userLendingPairData = createUserPair(user, pair)
  }

  return userLendingPairData as UserPair
}

function getUserPairId(user: Address, pair: Address): string {
  return user.toHex().concat('-').concat(pair.toHex())
}
