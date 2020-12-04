import { Address } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from './constants'
import { UserBentoTokenData } from '../../../generated/schema'

export function getUserBentoTokenData(user: Address, token: Address): UserBentoTokenData {
  const uid = user.toHex()
  const tid = token.toHex()
  const id = uid.concat('-').concat(tid)

  let userBentoTokenData = UserBentoTokenData.load(id)

  if (userBentoTokenData === null) {
    userBentoTokenData = new UserBentoTokenData(id)
    userBentoTokenData.owner = uid
    userBentoTokenData.token = tid
    userBentoTokenData.share = BIG_INT_ZERO
    userBentoTokenData.save()
  }

  return userBentoTokenData as UserBentoTokenData
}
