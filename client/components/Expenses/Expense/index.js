import React, { Component, PropTypes } from 'react';
import { FormControl, ControlLabel, Col, HelpBlock } from 'react-bootstrap';

export default class Expense extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string),
    item: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }
  static defaultProps = {
    currencies: ['usd'],
  }

  handlePropertyChange(e){
    let {item} = this.props;
    if (e.target.id === 'cost'){
      item[e.target.id] = parseFloat(e.target.value);
    }else{
      item[e.target.id] = e.target.value;
    }
    this.props.onChange(item);
  }

  render() {
    const {item, currencies} = this.props;

    return (
      <Col sm={12}>
        <ControlLabel className="col-sm-1">Type</ControlLabel>
        <Col sm={8}>
        <FormControl
            id="name"
            onChange={::this.handlePropertyChange}
            required
            value={item['name']}
        />
        </Col>
        <Col sm={3}>
          <HelpBlock>This is required</HelpBlock>
        </Col>

        <ControlLabel className="col-sm-1">Cost</ControlLabel>
        <Col sm={3}>
          <FormControl
              id="cost"
              onChange={::this.handlePropertyChange}
              required
              type="number"
              value={item['cost']}
          />
        </Col>
        <Col sm={3}>
          <FormControl
              componentClass="select"
              id="currency"
              onChange={::this.handlePropertyChange}
              required
              value={item['currency']}
          >
            {
              currencies.map(currency=><option value={currency}>{currency.toUpperCase()}</option>)
            }
          </FormControl>
        </Col>
        <Col sm={3}>
          <HelpBlock>This is required</HelpBlock>
        </Col>

        <Col sm={12}>
          <FormControl
              id="comments"
              onChange={::this.handlePropertyChange}
              placeholder="Comments"
              value={item['comments']}
          />
        </Col>
      </Col>
    );
  }
}
