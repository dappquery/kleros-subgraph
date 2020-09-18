import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import TableRow from "./TableRow";
import Address from "./Address";
import {Query} from 'react-apollo'
import {TOTAL_COURTS, DISPUTES} from "../graphql/queries";
import Badge from "react-bootstrap/Badge";
import {Court, Period} from "./Home";
import VerticallyCenteredModal from "./VerticallyCenteredModal";
import DisputesDetails from "./DisputeDetails";

interface Props {
}

interface State {
  showModal: boolean
  disputeId?: string;
}

interface Variable {

}

interface DisputesData {
  disputeCreations: Array<{
    arbitrable:string;
    contractAddress:string;
    disputeID:string;
    id:string;
    timestamp: string;
    blockNumber: string;
    subcourtID: string;
    numberOfChoices: string;
    period: string;
    lastPeriodChange: string;
    drawsInRound: string;
    commitsInRound: string;
    ruled: boolean
  }>
}

export default class DisputesTable extends React.Component<Props, State> {


  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      showModal: false
    }
    this.onClickDispute = this.onClickDispute.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onClickDispute(disputeId) {
    console.log('dispute clicked');
    this.setState({showModal: true, disputeId});
  }

  onCloseModal() {
    console.log('onCloseModal');
    this.setState({showModal: false});
  }
  render() {
    return <Card style={{height:"400px",overflow:"scroll"}}>
      <Card.Body>
        <Card.Title>Recent Disputes</Card.Title>
        <VerticallyCenteredModal
          show={this.state.showModal}
          onHide={this.onCloseModal}
          content={<DisputesDetails disputeId={this.state.disputeId}/>}
          heading="Dispute Details"
          title={`Dispute Id ${this.state.disputeId}`}
        />
        <TableRow
          col={[
            <strong>Id</strong>,
            //<strong>Dispute Period(Status)</strong>,
            <strong>Arbitrable</strong>,
            <strong>Court</strong>,
            <strong>Choices</strong>
          ]}/>
        <Query<DisputesData, Variable> query={DISPUTES}>
          {({loading, error, data}) => {
            if (loading) return <span>{'Loading...'}</span>;
            if (error) return <span>{`Error! ${error.message}`}</span>;

            return data.disputeCreations.map(d => {
              return <TableRow /*onClick={() => {
                this.onClickDispute(d.disputeID)
              }}*/
                               col={[d.disputeID, /*Period[parseInt(d.period)]*/,
                                 <Address
                  address={d.arbitrable}/>,
                                 Court[d.subcourtID],
                                 d.numberOfChoices]}/>
            })
          }}
        </Query>
      </Card.Body>
    </Card>
  }
}
