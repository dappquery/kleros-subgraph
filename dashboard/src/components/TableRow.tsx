import * as React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {ReactNode} from "react";

interface Props {
  col: ReactNode[]
  onClick?: any;
}

interface State {

}

export default class TableRow extends React.Component<Props, State> {


  constructor(props: Readonly<Props>) {
    super(props);
  }

  render() {
    return <div onClick={this.props.onClick} style={{cursor: "pointer"}}>
      <Row

        style={{
      borderBottom: "1px",
      borderBottomStyle: "solid",
      borderColor: "#e7eaf3",
      marginTop: ".75rem",
      marginBottom: ".75rem",
      padding:"5px"
        }}>
      {this.props.col.map(c => <Col>{c}</Col>)}
    </Row>
    </div>
  }

}

