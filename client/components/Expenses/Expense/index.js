import React, { Component, PropTypes } from 'react';
import { FormControl, ControlLabel, Col, HelpBlock } from 'react-bootstrap';

export default class Expense extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string),
    item: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }
  static defaultProps = {
    currencies: ['usd','nis'],
  }

  handlePropertyChange(type, value){
    let {item} = this.props;
    if (type === 'cost'){
      item[type] = parseFloat(value);
    }else{
      item[type] = value;
    }
    this.props.onChange(item);
  }

  render() {
    const {item, currencies} = this.props;

    return (
      <Col sm={12} style={{marginBottom:10}}>
        <ControlLabel className="col-sm-1">Type</ControlLabel>
        <Col sm={8}>
        <FormControl
            defaultValue={item.name}
            onChange={e=>::this.handlePropertyChange('name', e.target.value)}
            required
        />
        </Col>
        <Col sm={3}>
          <HelpBlock>This is required</HelpBlock>
        </Col>

        <ControlLabel className="col-sm-1">Cost</ControlLabel>
        <Col sm={3}>
          <FormControl
              defaultValue={item.cost}
              onChange={e=>::this.handlePropertyChange('cost', e.target.value)}
              required
          />
        </Col>
        <Col sm={3}>
          <FormControl
              componentClass="select"
              defaultValue={item.currency||currencies[0]}
              onChange={e=>::this.handlePropertyChange('currency', e.target.value)}
              required
          >
            {
              currencies.map(currency=><option key={currency} value={currency}>{currency.toUpperCase()}</option>)
            }
          </FormControl>
        </Col>
        <Col sm={3}>
          <HelpBlock>This is required</HelpBlock>
        </Col>

        <Col sm={12}>
          <FormControl
              defaultValue={item.comments}
              onChange={e=>::this.handlePropertyChange('comments', e.target.value)}
              placeholder="Comments"
          />
        </Col>
      </Col>
    );
  }
}
