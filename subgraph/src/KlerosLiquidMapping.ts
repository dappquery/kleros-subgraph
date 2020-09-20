import {
  NewPhase as NewPhaseEvent,
  NewPeriod as NewPeriodEvent,
  StakeSet as StakeSetEvent,
  Draw as DrawEvent,
  TokenAndETHShift as TokenAndETHShiftEvent,
  DisputeCreation as DisputeCreationEvent,
  AppealPossible as AppealPossibleEvent,
  AppealDecision as AppealDecisionEvent,
  KlerosLiquid, CreateSubcourtCall,
} from "../generated/KlerosLiquid/KlerosLiquid"
import {
  NewPolicy,
  NewPeriod,
  StakeSet,
  Draw,
  TokenAndETHShift,
  DisputeCreation,
  AppealPossible,
  AppealDecision,
  DisputeStatistic,
  PeriodDisputeStatistic,
  JurorStakeAmount,
  RewardStatistic,
  DisputePeriodMap,
  SubCourtDisputeStatistic,
  TotalStaked,
  TotalJuror,
  Court,
  CourtCount
} from "../generated/KlerosLiquidSchema"
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

export function handleNewPhase(event: NewPhaseEvent): void {
  let entity = new NewPolicy(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.phase = event.params._phase
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleNewPeriod(event: NewPeriodEvent): void {
  let entity = new NewPeriod(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.disputeID = event.params._disputeID
  entity.period = event.params._period
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()

  // load dispute vs period map
  let disputeId = event.params._disputeID.toString()
  let entity1 = DisputePeriodMap.load(disputeId)
  if(entity1 == null){
    entity1 = new DisputePeriodMap(disputeId)
  } else {
    // Subtract count if dispute exists with a different/same period to avoid duplicate counts
    let charCodePeriod = String.fromCharCode(entity1.period)
    let entity2 = PeriodDisputeStatistic.load(charCodePeriod)
    entity2.totalDisputes = entity2.totalDisputes.minus(BigInt.fromI32(1))
    entity2.save()
  }
  entity1.period = event.params._period
  entity1.save()

  // Save Period Vs Dispute stats
  let charCodePeriod = String.fromCharCode(event.params._period)
  log.info('Period', [charCodePeriod])
  let entity2 = PeriodDisputeStatistic.load(charCodePeriod)
  if (entity2 == null) {
    entity2 = new PeriodDisputeStatistic(charCodePeriod)
    entity2.period = event.params._period
    entity2.totalDisputes = BigInt.fromI32(1)
    log.info('Initializing Period', [charCodePeriod])
  } else{
    entity2.period = event.params._period
    entity2.totalDisputes = entity2.totalDisputes.plus(BigInt.fromI32(1))
    log.info('Incrementing dispute count', [charCodePeriod])
  }
  entity2.save()
}

export function handleStakeSet(event: StakeSetEvent): void {
  let entity = new StakeSet(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.address = event.params._address
  entity.subcourtID = event.params._subcourtID
  entity.stake = event.params._stake
  entity.newTotalStake = event.params._newTotalStake
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()

  let totalStakedEntity = TotalStaked.load('ID')
  if (totalStakedEntity == null){
    log.debug('initializing total staked entity', [])
    totalStakedEntity = new TotalStaked('ID')
    totalStakedEntity.totalStakedAmount = BigInt.fromI32(0)
  }

  let totalJurorEntity = TotalJuror.load('ID')
  if(totalJurorEntity == null) {
    log.debug('initializing total jurors entity', [])
    totalJurorEntity = new TotalJuror('ID')
    totalJurorEntity.totalJurorCount = BigInt.fromI32(0)
  }

  // Always update with the latest total stake for a juror
  let parsedId = event.params._address.toHex();
  let jurorStakedAmountEntity = JurorStakeAmount.load(parsedId)
  if (jurorStakedAmountEntity == null) {
    jurorStakedAmountEntity = new JurorStakeAmount(parsedId)
    jurorStakedAmountEntity.juror = event.params._address
    jurorStakedAmountEntity.stakeAmount = event.params._newTotalStake

    // Add newTotalStake amount for first time juror
    log.debug('sum total staked entity for first time juror', [event.params._newTotalStake.toString()])
    totalStakedEntity.totalStakedAmount = totalStakedEntity.totalStakedAmount.plus(event.params._newTotalStake)

    // First time juror staked
    totalJurorEntity.totalJurorCount = totalJurorEntity.totalJurorCount.plus(BigInt.fromI32(1))
  } else{
    jurorStakedAmountEntity.juror = event.params._address
    // Subtract old staked amount and sum new staked amount
    log.debug('sum total staked entity for repeting juror', [event.params._newTotalStake.toString()])
    totalStakedEntity.totalStakedAmount = (totalStakedEntity.totalStakedAmount.plus(event.params._newTotalStake)).minus(jurorStakedAmountEntity.stakeAmount)
    // update juror staked amount
    jurorStakedAmountEntity.stakeAmount = event.params._newTotalStake
  }
  log.debug('updated total staked', [totalStakedEntity.totalStakedAmount.toString()])
  jurorStakedAmountEntity.save()
  totalStakedEntity.save()
  totalJurorEntity.save()
}

export function handleDraw(event: DrawEvent): void {
  let entity = new Draw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.address = event.params._address
  entity.disputeID = event.params._disputeID
  entity.appeal = event.params._appeal
  entity.voteID = event.params._voteID
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleTokenAndETHShift(event: TokenAndETHShiftEvent): void {
  let entity = new TokenAndETHShift(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.address = event.params._address
  entity.disputeID = event.params._disputeID
  entity.tokenAmount = event.params._tokenAmount
  entity.ETHAmount = event.params._ETHAmount
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()

  // Reward stats
  let entity1 = RewardStatistic.load('ID')
  if (entity1 == null) {
    entity1 = new RewardStatistic('ID')
    // Initialize
    entity1.totalRewardedTokenAmount = BigInt.fromI32(0)
    entity1.totalRewardedEthAmount = BigInt.fromI32(0)
    entity1.totalPunishedTokenAmount = BigInt.fromI32(0)
  }
  // log.info('handleTokenAndETHShift.entity1 present',
  // [entity1.totalRewardedTokenAmount.toString()])
  if(event.params._tokenAmount.ge(BigInt.fromI32(0))){
    // log.info('handleTokenAndETHShift.entity1 adding amount', [])
    entity1.totalRewardedTokenAmount = entity1.totalRewardedTokenAmount.plus(event.params._tokenAmount)
    entity1.totalRewardedEthAmount = entity1.totalRewardedEthAmount.plus(event.params._ETHAmount)
  } else {
    // log.info('handleTokenAndETHShift.entity1 -ve tokenamount',
    // [event.params.tokenAmount.toString()])
    entity1.totalPunishedTokenAmount = entity1.totalPunishedTokenAmount.plus(event.params._tokenAmount)
  }
  entity1.save()
}

export function handleDisputeCreation(event: DisputeCreationEvent): void {
  let entity = new DisputeCreation(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.disputeID = event.params._disputeID
  entity.arbitrable = event.params._arbitrable
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number

  log.debug('binding KlerosLiquid contract', [])
  let contract = KlerosLiquid.bind(event.address)
  log.debug('reading dispute mapping', [])
  let disputeObj = contract.disputes(event.params._disputeID)
  log.debug('dispute mapping is read', [])
  log.debug('disputeObj value0', [disputeObj.value0.toHex()])
  entity.subcourtID = disputeObj.value0
  entity.numberOfChoices = disputeObj.value2
  entity.period = disputeObj.value3
  entity.lastPeriodChange = disputeObj.value4
  entity.drawsInRound = disputeObj.value5;
  entity.commitsInRound = disputeObj.value6;
  entity.ruled = disputeObj.value7;
  log.debug('Saving entity', [])
  entity.save()

  let entity1 = DisputeStatistic.load('ID')
  if (entity1 == null) {
    entity1 = new DisputeStatistic('ID')
    entity1.totalDisputes = BigInt.fromI32(1)
  } else{
    entity1.totalDisputes = entity1.totalDisputes.plus(BigInt.fromI32(1))
  }
  entity1.save()

  // Save SubCourtDisputeStatistic
  let id = entity.subcourtID.toHex()
  let subCourtDisputeCount = SubCourtDisputeStatistic.load(id)
  if (subCourtDisputeCount == null) {
    subCourtDisputeCount = new SubCourtDisputeStatistic(id)
    subCourtDisputeCount.subcourtID = entity.subcourtID
    subCourtDisputeCount.totalDisputes = BigInt.fromI32(1)
  } else{
    subCourtDisputeCount.subcourtID = entity.subcourtID
    subCourtDisputeCount.totalDisputes = subCourtDisputeCount.totalDisputes.plus(BigInt.fromI32(1))
  }
  subCourtDisputeCount.save()

  // Save subcourtID Vs disputeCount
  let court = Court.load(id)
  if (court == null) {
    court = new Court(id)
    court.disputeCount = BigInt.fromI32(1)
  } else {
    court.disputeCount = BigInt.fromI32(0)
    // if(court.disputeCount == null) {
    //  court.disputeCount = BigInt.fromI32(0)
    // }
    // court.disputeCount = court.disputeCount.plus(BigInt.fromI32(1))
  }

  let courtObject = contract.courts(entity.subcourtID)
  court.alpha = courtObject.value3
  court.feeForJuror = courtObject.value4
  court.jurorsForCourtJump = courtObject.value5
  court.minStake = BigInt.fromI32(0)// courtObject.value2
  court.subcourtID = entity.subcourtID
  court.save();

}

export function handleAppealPossible(event: AppealPossibleEvent): void {
  let entity = new AppealPossible(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.disputeID = event.params._disputeID
  entity.arbitrable = event.params._arbitrable
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleAppealDecision(event: AppealDecisionEvent): void {
  let entity = new AppealDecision(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.disputeID = event.params._disputeID
  entity.arbitrable = event.params._arbitrable
  entity.contractAddress = event.address
  entity.timestamp = event.block.timestamp
  entity.blockNumber = event.block.number
  entity.save()
}

export function handleCreateSubcourt(call: CreateSubcourtCall): void {

  log.debug('handleCreateSubcourt: Handling call for  create sub court',[])
  log.debug('handleCreateSubcourt: call.to {} ', [call.to.toHexString()])
  let contract = KlerosLiquid.bind(call.to)
  let courtCount = CourtCount.load('ID')
  if (courtCount == null) {
    courtCount = new CourtCount('ID')
    courtCount.count = BigInt.fromI32(0)
  }

  courtCount.count = courtCount.count.plus(BigInt.fromI32(1))
  courtCount.save();
  log.debug('handleCreateSubcourt: Saved court count',[])
  let idCount = courtCount.count.minus(BigInt.fromI32(1))
  let id = idCount.toHexString()
  let court = Court.load(id)
  if (court == null) {
    court = new Court(id)
  }

  let courtObject = contract.courts(idCount)
  log.debug('handleCreateSubcourt: contract call data value 0 {}', [courtObject.value0.toHexString()])
  log.debug('handleCreateSubcourt: contract call data value 5 {}', [courtObject.value5.toHexString()])
  court.alpha = courtObject.value3
  court.feeForJuror = courtObject.value4
  court.jurorsForCourtJump = courtObject.value5
  court.minStake = BigInt.fromI32(0) //courtObject.value2
  court.subcourtID = courtCount.count
  court.disputeCount = BigInt.fromI32(0)
  court.save();
}
