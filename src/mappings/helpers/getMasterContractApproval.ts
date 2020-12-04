import { Address } from '@graphprotocol/graph-ts'
import { MasterContractApproval } from '../../../generated/schema'

export function getMasterContractApproval(user: Address, masterContract: Address): MasterContractApproval {
  const uid = user.toHex()
  const mid = masterContract.toHex()
  const id = uid.concat('-').concat(mid)

  let masterContractApproval = MasterContractApproval.load(id)

  if (masterContractApproval === null) {
    masterContractApproval = new MasterContractApproval(id)
    masterContractApproval.owner = uid
    masterContractApproval.approved = false
    masterContractApproval.save()
  }

  return masterContractApproval as MasterContractApproval
}
