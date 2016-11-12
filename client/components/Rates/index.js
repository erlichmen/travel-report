import React, { Component, PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col, HelpBlock } from 'react-bootstrap';

import './style.css';

class ExchangeRates extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    rates: PropTypes.shape({
      usd: PropTypes.number,
    }),
  }

  constructor(props){
    super(props);

    this.state = {
      usd: 0,
    };
  }

  handleUSDChange = e => {
    this.setState({ usd: e.target.value });
  }

  isFormValid = () => {
    return Boolean(this.state.usd);
  }

  handleSubmitClick = () => {
    const { onSubmit } = this.props;
    if (!this.isFormValid()) {
      return;
    }

    const {
      usd,
      euro,
      gbp,
      uah,
    } = this.state;

    onSubmit({
      usd,
      euro,
      gbp,
      uah,
    });
  }

  render() {
    const {
      usd,
      euro,
      gbp,
      uah,
    } = this.state;

    return (
      <Form horizontal>
        <h2>Exchange Rates</h2>
        <FormGroup
            controlId="USD"
        >
            <ControlLabel className="col-sm-3">USD</ControlLabel>
            <Col sm={2}>
            <FormControl
                onChange={this.handleUSDChange}
                required
                type="number"
                value={usd}
            />
            </Col>
            <HelpBlock>This is required</HelpBlock>
        </FormGroup>
        <FormGroup
            controlId="EURO"
        >
            <ControlLabel className="col-sm-3">EURO</ControlLabel>
            <Col sm={2}>
            <FormControl
                type="number"
                value={euro}
            />
            </Col>
        </FormGroup>
        <FormGroup
            controlId="GBP"
        >
            <ControlLabel className="col-sm-3">GBP</ControlLabel>
            <Col sm={2}>
            <FormControl
                type="number"
                value={gbp}
            />
            </Col>
        </FormGroup>
        <FormGroup
            controlId="UAH"
        >
            <ControlLabel className="col-sm-3">UAH</ControlLabel>
            <Col sm={2}>
            <FormControl
                type="number"
                value={uah}
            />
            </Col>
        </FormGroup>
        <Button
            bsStyle="primary"
            className="pull-right"
            disabled={!this.isFormValid()}
            onClick={this.handleSubmitClick}
        >Continue</Button>
      </Form>
    );
  }
}

export default ExchangeRates;
