import * as React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

interface Props {
}

interface State {

}

export default class Header extends React.Component<Props, State> {


  constructor(props: Readonly<Props>) {
    super(props);
  }


  render() {
    return <Container>
      <Navbar bg="white">
        <Navbar.Brand href="#home">
          <img
            alt="Metrics Dashboard | Kleros"
            src="logo.png"
            width="90"
            height="90"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Brand style={{marginLeft: "20%"}}><strong style={{fontSize:"24px"}}>Performance Metrics Dashboard</strong></Navbar.Brand>
      </Navbar>
    </Container>
  }
}
