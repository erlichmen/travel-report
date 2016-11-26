import React, { Component, PropTypes } from 'react';
import { Form, ButtonToolbar, FormGroup, FormControl, ControlLabel, Button, Col, HelpBlock, Glyphicon } from 'react-bootstrap';

export default class Expense extends Component {
  static propTypes = {
    item: PropTypes.obj,
    onChange: PropTypes.func.required,
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
    return (
      <Col sm={12}>
        <ControlLabel className="col-sm-1">Type</ControlLabel>
        <Col sm={8}>
        <FormControl
            id="type"
            onChange={::this.handlePropertyChange}
            required
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
          />
        </Col>
        <Col sm={3}>
          <FormControl
              id="currency"
              onChange={::this.handlePropertyChange}
              required
          />
        </Col>
        <Col sm={3}>
          <HelpBlock>This is required</HelpBlock>
        </Col>

        <Col sm={12}>
          <FormControl
              id="comments"
              onChange={::this.handlePropertyChange}
              placeholder="Comments"
          />
        </Col>
      </Col>
    );
  }
}
