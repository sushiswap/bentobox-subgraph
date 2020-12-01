import { Address, BigInt, ByteArray, dataSource, log } from "@graphprotocol/graph-ts";
import { BentoBox, LendingPair, Token } from "../../generated/schema";
import {
  BentoBox as BentoBoxContract,
  LogDeploy,
  LogDeposit,
  LogFlashLoan,
  LogSetMasterContractApproval,
  LogTransfer,
  LogWithdraw,
} from "../../generated/BentoBox/BentoBox";

import { ERC20 as ERC20Contract } from '../../generated/BentoBox/ERC20'
import { LendingPair as LendingPairContract } from '../../generated/BentoBox/LendingPair'
import { LendingPair as LendingPairTemplate } from '../../generated/templates'

export function handleLogDeploy(event: LogDeploy): void {

  log.info("[BentoBox] Log Deploy {} {} {}", [
    event.params.clone_address.toHex(),
    event.params.data.toHex(),
    event.params.masterContract.toHex(),
  ]);

  const data = event.params.data.toHex()

  const collateral = data.substring(26, 66)

  const asset = data.substring(90, 130)

  const oracle = data.substring(154, 194)

  log.info("[BentoBox] Deploy Data collateral: {} asset: {} oracle: {}", [
    '0x' + collateral,
    '0x' + asset,
    '0x' + oracle
  ]);


  let bentoBox = BentoBox.load(dataSource.address().toHex());

  if (bentoBox == null) {
    const bentoBoxContract = BentoBoxContract.bind(dataSource.address())
    bentoBox = new BentoBox(dataSource.address().toHex());
    bentoBox.WETH = bentoBoxContract.WETH()
  }

  bentoBox.save();

  // Already initilised
  if (LendingPair.load(event.params.clone_address.toHex())) {
    return;
  }
  if(event.params.masterContract.toHex() == "0xdae20fa3487e3fe47de1e7ea973fc42b6cfe4737"){
  // Bind to contract for easy data access on creation
  const lendingPairContract = LendingPairContract.bind(event.params.clone_address)

  const lendingPair = new LendingPair(event.params.clone_address.toHex())

  lendingPair.asset = lendingPairContract.asset()
  lendingPair.bentoBox = bentoBox.id
  lendingPair.borrowOpeningFee = lendingPairContract.borrowOpeningFee()
  lendingPair.closedCollaterizationRate = lendingPairContract.closedCollaterizationRate()
  lendingPair.collateral = lendingPairContract.collateral()
  lendingPair.decimals = lendingPairContract.decimals()
  lendingPair.dev = lendingPairContract.dev()
  lendingPair.devFee = lendingPairContract.devFee()
  lendingPair.exchangeRate = lendingPairContract.exchangeRate()
  lendingPair.feeTo = lendingPairContract.feeTo()
  lendingPair.feesPendingShare = lendingPairContract.feesPendingShare()
  lendingPair.interestElasticity = lendingPairContract.interestElasticity()
  lendingPair.interestPerBlock = lendingPairContract.interestPerBlock()
  lendingPair.lastBlockAccrued = lendingPairContract.lastBlockAccrued()
  lendingPair.liquidationMultiplier = lendingPairContract.liquidationMultiplier()
  lendingPair.masterContract = lendingPairContract.masterContract()
  lendingPair.maximumInterestPerBlock = lendingPairContract.maximumInterestPerBlock()
  lendingPair.maximumTargetUtilization = lendingPairContract.maximumTargetUtilization()
  lendingPair.minimumInterestPerBlock = lendingPairContract.minimumInterestPerBlock()
  lendingPair.minimumTargetUtilization = lendingPairContract.minimumTargetUtilization()
  lendingPair.name = lendingPairContract.name()
  lendingPair.openCollaterizationRate = lendingPairContract.openCollaterizationRate()
  lendingPair.oracle = lendingPairContract.oracle()
  lendingPair.owner = lendingPairContract.owner()
  lendingPair.pendingOwner = lendingPairContract.pendingOwner()
  lendingPair.protocolFee = lendingPairContract.protocolFee()
  lendingPair.startingInterestPerBlock = lendingPairContract.startingInterestPerBlock()
  lendingPair.symbol = lendingPairContract.symbol()
  lendingPair.totalAssetShare = lendingPairContract.totalAssetShare()
  lendingPair.totalBorrowFraction = lendingPairContract.totalBorrowFraction()
  lendingPair.totalBorrowShare = lendingPairContract.totalBorrowShare()
  lendingPair.totalCollateralShare = lendingPairContract.totalCollateralShare()
  lendingPair.totalSupply = lendingPairContract.totalSupply()
  lendingPair.block = event.block.number
  lendingPair.timestamp = event.block.timestamp

  lendingPair.save()

  LendingPairTemplate.create(event.params.clone_address)

  }

  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex());

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new ExampleEntity(event.transaction.from.toHex());

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0);
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1);

  // // Entity fields can be set based on event parameters
  // entity.masterContract = event.params.masterContract;
  // entity.data = event.params.data;

  // // Entities can be written to the store with `.save()`
  // entity.save();

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

export function handleLogDeposit(event: LogDeposit): void {
  log.info("[BentoBox] Log Deposit {} {} {} {} {}", [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.share.toString(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ]);
  let bentoAddress = event.address.toHex();
  let token = Token.load(event.params.token.toHex());

  if (token == null) {
    token = new Token(event.params.token.toHex());
    token.bentoBox = bentoAddress;
    token.totalShare = BigInt.fromI32(0);
    token.totalAmount = BigInt.fromI32(0);
  }

  token.totalAmount = token.totalAmount.plus(event.params.amount);
  token.totalShare = token.totalShare.plus(event.params.share);
  token.save();
}

export function handleLogFlashLoan(event: LogFlashLoan): void {
  log.info("[BentoBox] Log Flash Loan {} {} {} {}", [
    event.params.amount.toString(),
    event.params.feeAmount.toString(),
    event.params.token.toHex(),
    event.params.user.toHex(),
  ]);
  let token = Token.load(event.params.token.toHex());
  token.totalAmount = token.totalAmount.plus(event.params.feeAmount);
  token.save();
}

export function handleLogSetMasterContractApproval(
  event: LogSetMasterContractApproval
): void {
  log.info("[BentoBox] Log Set Master Contract Approval {} {} {}", [
    event.params.approved == true ? 'true' : 'false',
    event.params.masterContract.toHex(),
    event.params.user.toHex(),
  ]);
}

export function handleLogTransfer(event: LogTransfer): void {
  log.info("[BentoBox] Log Transfer {} {} {} {} {}", [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.share.toString(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ]);
}

export function handleLogWithdraw(event: LogWithdraw): void {
  log.info("[BentoBox] Log Withdraw {} {} {} {} {}", [
    event.params.amount.toString(),
    event.params.from.toHex(),
    event.params.share.toString(),
    event.params.to.toHex(),
    event.params.token.toHex(),
  ]);
  let token = Token.load(event.params.token.toHex());
  token.totalAmount = token.totalAmount.minus(event.params.amount);
  token.totalShare = token.totalShare.minus(event.params.share);
  token.save();
}
