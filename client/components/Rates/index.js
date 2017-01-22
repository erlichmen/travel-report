import React, { Component, PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col, HelpBlock,
 Glyphicon, Row } from 'react-bootstrap';

import NewRate from './NewRate';

import './style.css';

class ExchangeRates extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    rates: PropTypes.shape({
      usd: PropTypes.number,
      euro: PropTypes.number,
      gbp: PropTypes.number,
      uah: PropTypes.number,
    }),
  }

  constructor(props){
    super(props);

    this.state = {
      usd:props.rates&&props.rates.usd?props.rates.usd:undefined,
      euro:props.rates&&props.rates.euro?props.rates.euro:undefined,
      gbp:props.rates&&props.rates.gbp?props.rates.gbp:undefined,
      uah:props.rates&&props.rates.uah?props.rates.uah:undefined,
      isAdding: false,
      addedRates: [],
    };
  }

  handleCurrencyChange = (e,cureency) => {
    this.setState({ [cureency]: parseFloat(e.target.value) });
  }

  isFormValid = () => {
    return Boolean(this.state.usd);
  }

  handleSubmitClick = (back=false) => {
    const { onSubmit } = this.props;
    if (back && !this.isFormValid()) {
      return onSubmit(dataToReturn, back);
    }else if (!this.isFormValid()) {
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

    onSubmit(dataToReturn, back);
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
      { name, value: parseFloat(newValue) },
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
                defaultValue={usd}
                onChange={e=>this.handleCurrencyChange(e, 'usd')}
                required
                type="number"
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
                defaultValue={euro}
                onChange={e=>this.handleCurrencyChange(e, 'euro')}
                type="number"
            />
            </Col>
        </FormGroup>
        <FormGroup
            controlId="GBP"
        >
            <ControlLabel className="col-sm-3">GBP</ControlLabel>
            <Col sm={2}>
            <FormControl
                defaultValue={gbp}
                onChange={e=>this.handleCurrencyChange(e, 'gbp')}
                type="number"
            />
            </Col>
        </FormGroup>
        <FormGroup
            controlId="UAH"
        >
            <ControlLabel className="col-sm-3">UAH</ControlLabel>
            <Col sm={2}>
            <FormControl
                defaultValue={uah}
                onChange={e=>this.handleCurrencyChange(e, 'uah')}
                type="number"
            />
            </Col>
        </FormGroup>
        { addedRates.map(({ name, value }) => {
          return (
            <FormGroup key={name}>
                <ControlLabel className="col-sm-3 form-label">{name.toUpperCase()}</ControlLabel>
                <Col sm={2}>
                    <FormControl
                        defaultValue={value}
                        onChange={e => this.changeRate(name, e.target.value)}
                        type="number"
                    />
                </Col>
                <Button onClick={() => this.removeRate(name)}>Remove</Button>
            </FormGroup>
          );
        })}

        <FormGroup>
          <Col sm={3} />
          <Col sm={9}>
            <Button onClick={this.handleAddRate}>Add Rate &nbsp;<Glyphicon glyph="plus" /></Button>
          </Col>
        </FormGroup>

        <Row>
          <Col sm={2} />
          <Col sm={3}>
            <a href="http://www.boi.org.il/he/Markets/ExchangeRates/Pages/Default.aspx" target="_blank">Bank of Israel</a>
          </Col>
          <Col sm={3}>
            <a href="https://www.oanda.com/currency/converter/" target="_blank">Other currencies</a>
          </Col>
        </Row>

        <Row>
          <Button
              bsStyle="info"
              className="pull-left"
              onClick={()=>::this.handleSubmitClick(true)}
          >
            Back
          </Button>
          <Button
              bsStyle="primary"
              className="pull-right"
              disabled={!this.isFormValid()}
              onClick={()=>::this.handleSubmitClick(false)}
          >
            Continue
          </Button>
        </Row>

        { isAdding && <NewRate closeModal={this.handleAddedRate} /> }
      </Form>
    );
  }
}

export default ExchangeRates;
