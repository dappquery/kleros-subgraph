import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CourtsTable from "./CourtsTable";
import DisputesTable from "./DisputesTable";
import AnalyticsHeader from "./AnalyticsHeader";
import Header from "./Header";
import BarGraphComponent from "./BarGraph";
import {Query} from 'react-apollo'
import {
  DISPUTE_WITH_PERIOD,
  TOP_FIVE_JURY_BY_STAKE_AMOUNT,
  TOTAL_COURTS
} from "../graphql/queries";
import Badge from "react-bootstrap/Badge";
import Web3 from 'web3';
import PieGraph from "./PieGraph";


interface Props {

}

interface State {

}

export enum Period {
  "Evidence submission",
  "Commit vote",
  "Vote casting",
  "Appeal",
  "Ruling done"
}

export enum Court  {
  "General",
  "Blockchain",
  "Non-Technical",
  "Exchange Token Listing",
  "Technical",
  "Marketing Services",
  "English Language",
  "Video Production"
}


interface DisputeWithPeriod {
  periodDisputeStatistics: Array<{
    period: Period;
    totalDisputes: string;
  }>
}

interface TopFiveJuryByStakeAmount {
  jurorStakeAmounts: Array<{
    juror: string;
    stakeAmount: string;
  }>
}


interface Variable {

}

export default class Home extends React.Component<Props, State> {


  constructor(props: Readonly<Props>) {
    super(props);
  }


  render() {
    return <Container>
      <Row>
        <Header/>
      </Row>
      <Row>
        <Col>
          <AnalyticsHeader/>
        </Col>
      </Row>
      <Row>
        <Col>
          <Query<TopFiveJuryByStakeAmount, Variable>
          query={TOP_FIVE_JURY_BY_STAKE_AMOUNT}>
          {({loading, error, data}) => {
            if (loading) return <span>{'Loading...'}</span>;
            if (error) return <span>{`Error! ${error.message}`}</span>;

            console.log(data);
            const graphData = data.jurorStakeAmounts.map(d => {
                return {
                  tokens: parseInt(Web3.utils.fromWei(d.stakeAmount, 'ether')) / 1000,
                  name: d.juror
                };
              }
            );

            return <BarGraphComponent data={graphData}
                                      dataKey='tokens'
                                      xAxis={"Juror"}
                                      yAxis={"PNK Token in Kilo(1000) ether"}
                                      title={"Top 5 Jurors by stake amount"}
                                      hideXAxis={true}
            />;
          }}
        </Query>

      </Col>
      <Col>

        <Query<DisputeWithPeriod, Variable> query={DISPUTE_WITH_PERIOD}>
        {({loading, error, data}) => {
          if (loading) return <span>{'Loading...'}</span>;
          if (error) return <span>{`Error! ${error.message}`}</span>;

          console.log(data);
          const graphData = data.periodDisputeStatistics.map(d => {
              return {
                value: parseInt(d.totalDisputes),
                name: Period[parseInt(d.period + "")]
              };
            }
          );

          console.log('pie graph data  ',graphData)
          return <PieGraph title={"Disputes by period"} data={graphData}/>
          // return <BarGraphComponent data={graphData}
          //                           dataKey='disputes'
          //                           xAxis={"Disputes state(period)"}
          //                           yAxis={"Disputes count"}
          //                           title={"Disputes by status(Period)"}
          // />;
        }}
      </Query>

      </Col>
    </Row>
      <Row>
        <Col>
          <CourtsTable/>
        </Col>
        <Col>
          <DisputesTable/>
        </Col>
      </Row>

    </Container>;
  }
}
