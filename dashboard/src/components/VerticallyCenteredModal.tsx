import * as React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {ReactNode} from "react";

interface Props {
  onHide:any;
  show:boolean;
  title:string;
  heading:string;
  content:ReactNode
}

interface State {

}

export default class VerticallyCenteredModal extends React.Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);
  }

  render() {

    return <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={this.props.show}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {this.props.heading}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{this.props.title}</h4>
        {this.props.content}
      </Modal.Body>
      <Modal.Footer>
        <Button  variant="secondary" onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  }
}
