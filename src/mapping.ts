import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  LogDeploy,
  LogDeposit,
  LogFlashLoan,
  LogSetMasterContractApproval,
  LogTransfer,
  LogWithdraw
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleLogDeploy(event: LogDeploy): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.masterContract = event.params.masterContract
  entity.data = event.params.data

  // Entities can be written to the store with `.save()`
  entity.save()

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
  // - contract.WETH(...)
  // - contract.masterContractApproved(...)
  // - contract.masterContractOf(...)
  // - contract.shareOf(...)
  // - contract.totalAmount(...)
  // - contract.totalShare(...)
  // - contract.toAmount(...)
  // - contract.toShare(...)
  // - contract.withdraw(...)
  // - contract.withdrawFrom(...)
  // - contract.withdrawShare(...)
  // - contract.withdrawShareFrom(...)
  // - contract.transfer(...)
  // - contract.transferFrom(...)
  // - contract.transferMultiple(...)
  // - contract.transferMultipleFrom(...)
  // - contract.transferShare(...)
  // - contract.transferShareFrom(...)
  // - contract.transferMultipleShare(...)
  // - contract.transferMultipleShareFrom(...)
  // - contract.skim(...)
  // - contract.skimTo(...)
  // - contract.skimETH(...)
  // - contract.skimETHTo(...)
}

export function handleLogDeposit(event: LogDeposit): void {}

export function handleLogFlashLoan(event: LogFlashLoan): void {}

export function handleLogSetMasterContractApproval(
  event: LogSetMasterContractApproval
): void {}

export function handleLogTransfer(event: LogTransfer): void {}

export function handleLogWithdraw(event: LogWithdraw): void {}
