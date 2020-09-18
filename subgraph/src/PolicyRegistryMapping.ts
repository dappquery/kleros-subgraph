import {
  log,
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal,
  json,
  ipfs
} from "@graphprotocol/graph-ts";

import {
  PolicyUpdate as NewPolicyUpdateEvent,
} from "../generated/Contract/PolicyRegistry"
import {
  PolicyUpdate,
} from "../generated/PolicyRegistrySchema"
import {Court} from "../generated/KlerosLiquidSchema";

export function handlePolicyUpdate(event: NewPolicyUpdateEvent): void {
  let entity = new PolicyUpdate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.subcourtID = event.params.subcourtID
  entity.policy = event.params.policy
  // let hash = entity.policy.split('"/ipfs/"')[1]
  // log.debug('handlePolicyUpdate: hash ', [hash])
  // let data = ipfs.cat(hash)
  // log.debug('handlePolicyUpdate: data from ipfs {}', [data!.toString()])
  // if (data != null) {
  //   let parsedData = json.fromBytes(data!).toObject()
  //   log.debug('handlePolicyUpdate  court details {}', [parsedData.get('name').toString()])
  // }
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
  let court = Court.load(event.params.subcourtID.toHexString())
  if (court == null) {
    court = new Court(event.params.subcourtID.toHexString())
  }
  court.subcourtID = event.params.subcourtID
  log.debug('handlePolicyUpdate: Policy for subcourt {} is {} ', [
    event.params.subcourtID.toHexString(),
    event.params.policy,
  ])
  court.policy = event.params.policy
  court.save()

}
