import React, { Component, PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col, HelpBlock } from 'react-bootstrap';

import NewRate from './NewRate';

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
      isAdding: false,
      addedRates: [],
    };
  }

  handleUSDChange = e => {
    this.setState({ usd: parseFloat(e.target.value) });
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
      addedRates,
    } = this.state;

    const dataToReturn = {
      usd,
      euro,
      gbp,
      uah,
    };

    addedRates.forEach(({ name, value }) => dataToReturn[name] = value);

    onSubmit(dataToReturn);
  }

  handleAddRate = () => {
    this.setState({ isAdding: true });
  }

  handleAddedRate = newRate => {
    if (!newRate) {
      return this.setState({ isAdding: false });
    }

    const oldAddedRates = this.state.addedRates;
    const newAddedRates = [...oldAddedRates, newRate];

    this.setState({
      isAdding: false,
      addedRates: newAddedRates,
    });
  }

  changeRate = (name, newValue) => {
    const oldAddedRates = this.state.addedRates;
    const index = oldAddedRates.findIndex(rate => rate.name === name);

    if (index < 0) {
      return;
    }

    const newAddedRates = [
      ...oldAddedRates.slice(0, index),
      { name, value: newValue },
      ...oldAddedRates.slice(index + 1),
    ];

    this.setState({ addedRates: newAddedRates });
  }

  removeRate = name => {
    const oldAddedRates = this.state.addedRates;
    const index = oldAddedRates.findIndex(rate => rate.name === name);

    if (index < 0) {
      return;
    }

    const newAddedRates = [
      ...oldAddedRates.slice(0, index),
      ...oldAddedRates.slice(index + 1),
    ];

    this.setState({ addedRates: newAddedRates });
  }

  render() {
    const {
      usd,
      euro,
      gbp,
      uah,
      isAdding,
      addedRates,
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
        { addedRates.map(({ name, value }) => {
          return (
                <FormGroup key={name}>
                    <ControlLabel className="col-sm-3 form-label">{name.toUpperCase()}</ControlLabel>
                    <Col sm={2}>
                        <FormControl
                            type="number"
                            value={value}
                            onChange={e => this.changeRate(name, e.target.value)}
                        />
                    </Col>
                    <Button onClick={() => this.removeRate(name)}>Remove</Button>
                </FormGroup>
            );
        })}
        <Button
            bsStyle="primary"
            className="pull-right"
            disabled={!this.isFormValid()}
            onClick={this.handleSubmitClick}
        >Continue</Button>
        <Button onClick={this.handleAddRate}>Add Rate</Button>
        { isAdding && <NewRate closeModal={this.handleAddedRate} /> }
      </Form>
    );
  }
}

export default ExchangeRates;
