import React, { Component, PropTypes } from 'react';
import { ButtonToolbar, FormGroup, Button, Col, Glyphicon } from 'react-bootstrap';
import Expense from '../Expense';

export default class ExpenseGroup extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string),
    items: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
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
    const {title, items, currencies} = this.props;

    return (
      <FormGroup
          controlId={title}
          style={{borderBottom:'1px solid #dcdcdc'}}
      >
        <Col sm={12}>
          <ButtonToolbar>
          <h3 className="col-sm-8">{title}</h3>
          <Col style={{marginTop:15}}  sm={3}>
            <Button onClick={::this.addItem}>Add &nbsp;<Glyphicon glyph="plus" /></Button>
          </Col>
          </ButtonToolbar>
        </Col>
        {
          items.map((item, index)=>
            <Expense
                currencies={currencies}
                key={index}
                item={item}
                onChange={item=>this.handleItemChange(index, item)}
            />
          )
        }
      </FormGroup>
    );
  }
}
