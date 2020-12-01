import {
  Approval,
  LendingPair as LendingPairContract,
  LogAddAsset,
  LogAddBorrow,
  LogAddCollateral,
  LogExchangeRate,
  LogRemoveAsset,
  LogRemoveBorrow,
  LogRemoveCollateral,
  OwnershipTransferred,
  Transfer
} from "../../generated/templates/LendingPair/LendingPair"
import { LendingPair } from "../../generated/schema";

import { log } from '@graphprotocol/graph-ts'

export function handleApproval(event: Approval): void {
  log.info("[BentoBox:LendingPair] Approval {} {} {}", [
    event.params._owner.toHex(),
    event.params._spender.toHex(),
    event.params._value.toString(),
  ]);

  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity._owner = event.params._owner
  // entity._spender = event.params._spender

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.approve(...)
  // - contract.asset(...)
  // - contract.balanceOf(...)
  // - contract.bentoBox(...)
  // - contract.borrowOpeningFee(...)
  // - contract.closedCollaterizationRate(...)
  // - contract.collateral(...)
  // - contract.decimals(...)
  // - contract.dev(...)
  // - contract.devFee(...)
  // - contract.exchangeRate(...)
  // - contract.feeTo(...)
  // - contract.feesPendingShare(...)
  // - contract.getInitData(...)
  // - contract.interestElasticity(...)
  // - contract.interestPerBlock(...)
  // - contract.isSolvent(...)
  // - contract.lastBlockAccrued(...)
  // - contract.liquidationMultiplier(...)
  // - contract.masterContract(...)
  // - contract.maximumInterestPerBlock(...)
  // - contract.maximumTargetUtilization(...)
  // - contract.minimumInterestPerBlock(...)
  // - contract.minimumTargetUtilization(...)
  // - contract.name(...)
  // - contract.nonces(...)
  // - contract.openCollaterizationRate(...)
  // - contract.oracle(...)
  // - contract.oracleData(...)
  // - contract.owner(...)
  // - contract.peekExchangeRate(...)
  // - contract.pendingOwner(...)
  // - contract.protocolFee(...)
  // - contract.startingInterestPerBlock(...)
  // - contract.swappers(...)
  // - contract.symbol(...)
  // - contract.totalAssetShare(...)
  // - contract.totalBorrowFraction(...)
  // - contract.totalBorrowShare(...)
  // - contract.totalCollateralShare(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
  // - contract.updateExchangeRate(...)
  // - contract.userBorrowFraction(...)
  // - contract.userCollateralShare(...)
}

export function handleLogAddAsset(event: LogAddAsset): void {
  log.info("[BentoBox:LendingPair] Log Add Asset {} {} {}", [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);

  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalSupply = lendingPair.totalSupply.plus(event.params.fraction);
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.plus(event.params.share);
  lendingPair.save();
}

export function handleLogAddBorrow(event: LogAddBorrow): void {
  log.info("[BentoBox:LendingPair] Log Add Borrow {} {} {}", [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.plus(event.params.fraction);
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.plus(event.params.share);
  lendingPair.save();
}

export function handleLogAddCollateral(event: LogAddCollateral): void {
  log.info("[BentoBox:LendingPair] Log Add Collateral {} {}", [
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.plus(event.params.share);
  lendingPair.save()
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
  log.info("[BentoBox:LendingPair] Log Exchange Rate {}", [
    event.params.rate.toString(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.exchangeRate = lendingPair.exchangeRate.plus(event.params.rate);
  lendingPair.save()
}

export function handleLogRemoveAsset(event: LogRemoveAsset): void {
  log.info("[BentoBox:LendingPair] Log Remove Asset {} {} {}", [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalSupply = lendingPair.totalSupply.minus(event.params.fraction);
  lendingPair.totalAssetShare = lendingPair.totalAssetShare.minus(event.params.share);
  lendingPair.save()
}

export function handleLogRemoveBorrow(event: LogRemoveBorrow): void {
  log.info("[BentoBox:LendingPair] Log Remove Borrow {} {} {}", [
    event.params.fraction.toString(),
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalBorrowFraction = lendingPair.totalBorrowFraction.minus(event.params.fraction);
  lendingPair.totalBorrowShare = lendingPair.totalBorrowShare.minus(event.params.share);
  lendingPair.save()
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
  log.info("[BentoBox:LendingPair] Log Remove Collateral {} {}", [
    event.params.share.toString(),
    event.params.user.toHex(),
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.totalCollateralShare = lendingPair.totalCollateralShare.minus(event.params.share);
  lendingPair.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.info("[BentoBox:LendingPair] Ownership Transfered {} {}", [
    event.params.newOwner.toHex(),
    event.params.previousOwner.toHex()
  ]);
  let lendingPair = LendingPair.load(event.address.toHex());
  lendingPair.owner = event.params.newOwner;
  lendingPair.save()
}

export function handleTransfer(event: Transfer): void {
  log.info("[BentoBox:LendingPair] Transfer {} {}", [
    event.params._from.toHex(),
    event.params._to.toHex(),
    event.params._value.toString(),
  ]);
}
