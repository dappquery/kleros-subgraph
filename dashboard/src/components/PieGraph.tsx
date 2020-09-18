import React, {PureComponent} from 'react';
import {
  PieChart, Pie, Sector, Cell, PieProps, Legend, Tooltip
} from 'recharts';
import Card from "react-bootstrap/Card";

interface State {

}

interface Props {
  data: Array<{
    name: string;
    value: number;
  }>
  title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

export default class PieGraph extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

  }


  render() {

    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <PieChart width={470} height={470}>
            <Pie
              data={this.props.data}
              cx={230}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {
                this.props.data.map((entry, index) => <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}/>)
              }
            </Pie>
            <Legend iconSize={10}
                    width={120}
                    height={140}
                    align="left"
                    layout="horizontal"
                    verticalAlign="middle"
            />
            <Tooltip/>
          </PieChart>
        </Card.Body>
      </Card>
    );
  }
}
