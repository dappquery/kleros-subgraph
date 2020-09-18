import * as React from "react";
import TableRow from "./TableRow";
import {Query} from 'react-apollo'
import {
  DISPUTE_PERIODS, DISPUTE_REWARD
} from "../graphql/queries";
import {Period} from "./Home";
import Web3 from 'web3';
import Address from "./Address";

interface Props {
  disputeId: string;
}

interface State {
  showModal: boolean
}

interface Variable {
  disputeID: string
}

interface DisputePeriods {
  newPeriods: Array<{
    period: string;
    timestamp: string
  }>
}

interface Reward {
  tokenAndETHShifts: Array<{
    ETHAmount: string;
    address: string;
    tokenAmount: string;
  }>
}

export default class DisputesDetails extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  periodHistory(disputeID: string) {
    return <Query<DisputePeriods, Variable>
      query={DISPUTE_PERIODS}
      variables={{disputeID}}
    >
      {({loading, error, data}) => {
        if (loading) return <span>{'Loading...'}</span>;
        if (error) return <span>{`Error! ${error.message}`}</span>;
        if (data.newPeriods.length == 0) {
          return '';
        }
        const output = [
          <strong>Period history</strong>,
          <TableRow col={[
            <strong>Period(Status)</strong>,
            <strong>Timestamp</strong>
          ]}/>];
        data.newPeriods.forEach((d) => {
          const date = new Date(parseInt(d.timestamp) * 1000);
          output.push(
            <TableRow col={
              [
                Period[parseInt(d.period)],
                `${date.toUTCString()}`
              ]
            }/>
          )
        })
        return output;
      }}
    </Query>;
  }

  reward(disputeID: string) {
    return <Query<Reward, Variable>
      query={DISPUTE_REWARD}
      variables={{disputeID}}
    >
      {({loading, error, data}) => {
        if (loading) return <span>{'Loading...'}</span>;
        if (error) return <span>{`Error! ${error.message}`}</span>;
        if (data.tokenAndETHShifts.length == 0) {
          return '';
        }
        const output = [
          <strong>Reward and Penalty</strong>,
          <TableRow col={[
            <strong>Juror Address</strong>,
            <strong>ETH</strong>,
            <strong>PNK</strong>
          ]}/>];
        data.tokenAndETHShifts.forEach((d) => {

          output.push(
            <TableRow col={
              [< Address address={d.address}/>,
                parseFloat(Web3.utils.fromWei(d.ETHAmount,'ether')).toFixed(2),
                parseFloat(Web3.utils.fromWei(d.tokenAmount,'ether')).toFixed(2)
              ]
            }/>
          )
        })
        return output;
      }}
    </Query>;
  }

  render() {
    const disputeID = this.props.disputeId;
    return <div>

      {this.periodHistory(disputeID)}
      {this.reward(disputeID)}

    </div>
  }
}
