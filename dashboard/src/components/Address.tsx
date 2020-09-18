import React, {Component} from 'react'
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

interface Props {
  address: string;
}

interface State {

}

export default class Address extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }


  render() {
    const link =`https://etherscan.io/address/${this.props.address}`;
    return <OverlayTrigger
      trigger={[ 'hover','click']}
      placement="top"
      overlay={
        <Popover id={this.props.address}>
          <Popover.Content>
            <strong>{this.props.address}</strong>
          </Popover.Content>
        </Popover>}
    >
      <a
        href={link}
        target="_blank"> {this.props.address.substr(0, 10) + '...'}</a>
    </OverlayTrigger>

  }
}
