import {
  BIG_INT_ZERO,
} from './constants'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { User } from '../../../generated/schema'

export function getUser(address: Address): User {
  const uid = address.toHex()

  let user = User.load(uid)

  if (user === null) {
    user = new User(uid)
    user.save()
  }

  return user as User
}
