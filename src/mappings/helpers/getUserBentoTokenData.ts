import { Address } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from './constants'
import { UserBentoTokenData, Token } from '../../../generated/schema'

export function getUserBentoTokenData(user: Address, token: Token): UserBentoTokenData {
  const uid = user.toHex()
  const tid = token.id
  const id = uid.concat('-').concat(tid)

  let userBentoTokenData = UserBentoTokenData.load(id)

  if (userBentoTokenData === null) {
    userBentoTokenData = new UserBentoTokenData(id)
    userBentoTokenData.owner = uid
    userBentoTokenData.token = token.id
    userBentoTokenData.amount = BIG_INT_ZERO
    userBentoTokenData.save()
  }

  return userBentoTokenData as UserBentoTokenData
}
