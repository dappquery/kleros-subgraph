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
} from "../generated/PolicyRegistry/PolicyRegistry"
import {
  PolicyUpdate,
} from "../generated/PolicyRegistrySchema"
import {Court} from "../generated/KlerosLiquidSchema";

export function handlePolicyUpdate(event: NewPolicyUpdateEvent): void {
  let entity = new PolicyUpdate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.subcourtID = event.params._subcourtID
  entity.policy = event.params._policy
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
  let court = Court.load(event.params._subcourtID.toHexString())
  if (court == null) {
    court = new Court(event.params._subcourtID.toHexString())
  }
  court.subcourtID = event.params._subcourtID
  log.debug('handlePolicyUpdate: Policy for subcourt {} is {} ', [
    event.params._subcourtID.toHexString(),
    event.params._policy,
  ])
  court.policy = event.params._policy
  court.save()

}
