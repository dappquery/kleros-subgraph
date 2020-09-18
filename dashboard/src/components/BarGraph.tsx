import React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label,
} from 'recharts';
import Card from "react-bootstrap/Card";

interface Props {
  dataKey: string;
  data: any[];
  xAxis: string;
  yAxis: string;
  title: string;
  hideXAxis?:boolean;
}

interface State {

}

export default class BarGraphComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

  }

  render() {
    if (this.props.dataKey.length == 0) {
      return null;
    }
    const dataPoint = this.props.data[0];
    console.log('datapoint  ', dataPoint);
    const keys = Object.keys(dataPoint).filter(key => key !== 'name');
    console.log('keys  ', keys);
    return (
      <Card style={{height: "100%"}}>
        <Card.Body>
           <Card.Title>{this.props.title}</Card.Title>
          <BarChart

            width={450}
            height={300}
            data={this.props.data}
            margin={{
              top: 30, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name" hide={this.props.hideXAxis} >
              <Label value={this.props.xAxis}
                     offset={-5}
                     position="insideBottom" />
            </XAxis>
            <YAxis label={{
              value: `${this.props.yAxis}`,
              offset: -2,
              angle: -90,
              position: 'insideBottomLeft'
            }}/>
            <Tooltip/>
            {
              keys.length !=1? <Legend /> : null
            }

            {keys.map(key =>
              <Bar dataKey={key} fill={'#'+Math.floor(Math.random()*16777215).toString(16)}/>
            )}

          </BarChart>
        </Card.Body>
      </Card>
    );
  }
}
