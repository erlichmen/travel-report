import React, { Component, PropTypes } from 'react';
import { Form, ButtonToolbar, FormGroup, FormControl, ControlLabel, Button, Col, HelpBlock, Glyphicon } from 'react-bootstrap';
import Expense from '../Expense'

export default class ExpenseGroup extends Component {
  static propTypes = {
    items: PropTypes.array,
    onChange: PropTypes.func.required,
    title: PropTypes.string.required,
  }

  handleItemChange(index, item){
    const {items} = this.props;
    items[index] = item;
    this.props.onChange(items);
  }

  addItem(){
    const {items} = this.props;
    items.push({});
    this.props.onChange(items);
  }

  render() {
    const {title, items} = this.props;

    return (
      <FormGroup
          controlId={title}
      >
        <Col sm={12}>
          <ButtonToolbar>
          <h3 className="col-sm-8">{title}</h3>
          <Col sm={3}>
            <Button onClick={::this.addItem}><Glyphicon glyph="star" /> Add</Button>
          </Col>
          </ButtonToolbar>
        </Col>
        {
          items.map((item, index)=>
            <Expense
                item={item}
                onChange={item=>this.handleItemChange(index, item)}
            />
          )
        }
      </FormGroup>
    );
  }
}
