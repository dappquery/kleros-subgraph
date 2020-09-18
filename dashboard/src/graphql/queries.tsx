import gql from 'graphql-tag'

export const DISPUTE_COUNT = gql`
  {
    disputeStatistics(first: 1){
      id
      totalDisputes
    }
  }`;

export const TOTAL_COURTS = gql`
  {
    policyUpdates(first: 1,orderBy: subcourtID, orderDirection: desc, where:{policy_not:""}){
      subcourtID
    }
  }
`;

export const DISPUTE_WITH_PERIOD = gql`{
    periodDisputeStatistics{
    period
    totalDisputes
  }
}`;

export const TOP_FIVE_JURY_BY_STAKE_AMOUNT = gql`
  {
    jurorStakeAmounts(first: 5, orderBy: stakeAmount, orderDirection: desc, where:{stakeAmount_gt:0}){
      juror
      stakeAmount
    }
  }`;


export const DISPUTES = gql`
  {
    disputeCreations(orderBy: blockNumber, orderDirection:desc, first:10){
      id
      disputeID
      arbitrable
      contractAddress
      timestamp
      blockNumber
      subcourtID
      numberOfChoices
      period
      lastPeriodChange
      drawsInRound
      commitsInRound
      ruled
    }
  }
`;

export const REWARD_AND_PUNISHMENT = gql`
  {
    rewardStatistics(first: 1){
      id
      totalRewardedTokenAmount
      totalRewardedEthAmount
      totalPunishedTokenAmount
    }
  }
`;

export const DISPUTE_PERIODS = gql`query ($disputeID: BigInt!) {
  newPeriods(first: 100, where: {disputeID:$disputeID}, orderBy: timestamp, orderDirection: asc) {
    id
    disputeID
    period
    timestamp
    contractAddress
  }
}`;

export const DISPUTE_REWARD = gql
  `query ($disputeID: BigInt!) {
    tokenAndETHShifts(where: {disputeID: $disputeID}, orderBy: timestamp, orderDirection: desc) {
    address
    tokenAmount
    ETHAmount
  }
}`;

export const TOTAL_STAKED_AMOUNT = gql`{
        totalStakeds {
            totalStakedAmount
        }
    }
`;

export const TOTAL_JUROR = gql`{
    totalJurors{
        totalJurorCount
    }
}
`;

// export const COURTS = gql`{
//
//   courts {
//     id
//     subcourtID
//     policy
//     feeForJuror
//     minStake
//     jurorsForCourtJump
//     alpha
//     disputeCount
//   }
// }
// `;

export const COURTS = gql`  
  query{courts(where:{subcourtID_not:null, minStake_not: null})
  {
    id
    subcourtID
    policy
    feeForJuror
    minStake
    jurorsForCourtJump
    alpha
  }
  }`
