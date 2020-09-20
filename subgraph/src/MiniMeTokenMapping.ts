import {
  ClaimedTokens as ClaimedTokensEvent,
  Transfer as TransferEvent,
  NewCloneToken as NewCloneTokenEvent,
  Approval as ApprovalEvent
} from "../generated/MiniMeToken/MiniMeToken"
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
  entity.token = event.params._token
  entity.controller = event.params._controller
  entity.amount = event.params._amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params._from
  entity.to = event.params._to
  entity.amount = event.params._amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleNewCloneToken(event: NewCloneTokenEvent): void {
  let entity = new NewCloneToken(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.cloneToken = event.params._cloneToken
  entity.snapshotBlock = event.params._snapshotBlock
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params._owner
  entity.spender = event.params._spender
  entity.amount = event.params._amount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}
