import { Address, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BENTOBOX_ADDRESS = Address.fromString('0x37afb60a724994975bf8dcfda34eecb5e9c95943')

export const BENTOBOX_MEDIUM_RISK_PAIR = Address.fromString('0x8f1a5f04c9753f2eb38a852d32794c503a1a7cb5')

export const BIG_INT_MINUS_ONE = BigInt.fromI32(-1)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const BENTOBOX_DEPOSIT = 'deposit'

export const BENTOBOX_TRANSFER = 'transfer'

export const BENTOBOX_WITHDRAW = 'withdraw'

export const PAIR_ADD_COLLATERAL = 'addCollateral'

export const PAIR_REMOVE_COLLATERAL = 'removeCollateral'

export const PAIR_ADD_ASSET = 'addAsset'

export const PAIR_REMOVE_ASSET = 'removeAsset'

export const PAIR_ADD_BORROW = 'addBorrow'

export const PAIR_REMOVE_BORROW = 'removeBorrow'
