import {
  ClaimedTokens as ClaimedTokensEvent,
  Transfer as TransferEvent,
  NewCloneToken as NewCloneTokenEvent,
  Approval as ApprovalEvent
} from "../generated/Contract/MiniMeToken"
import {
  ClaimedTokens,
  Transfer,
  NewCloneToken,
  Approval
} from "../generated/MiniMeTokenSchema"

export function handleClaimedTokens(event: ClaimedTokensEvent): void {
  let entity = new ClaimedTokens(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.token = event.params.token
  entity.controller = event.params.controller
  entity.amount = event.params.amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleNewCloneToken(event: NewCloneTokenEvent): void {
  let entity = new NewCloneToken(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.cloneToken = event.params.cloneToken
  entity.snapshotBlock = event.params.snapshotBlock
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}
