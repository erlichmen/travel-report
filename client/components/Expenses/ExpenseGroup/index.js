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
    items.unshift({});
    this.props.onChange(items);
  }

  removeItem(index){
    const {items} = this.props;
    const newItems = items.slice(0,index).concat(items.slice(index+1));
    this.props.onChange(newItems);
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
          <Col style={{marginTop:15}} sm={2}>
            <Button onClick={::this.addItem}>Add &nbsp;<Glyphicon glyph="plus" /></Button>
          </Col>
          <h3 className="col-sm-8">{title}</h3>
          </ButtonToolbar>
        </Col>
        {
          items.map((item, index,items)=>
            <Expense
                currencies={currencies}
                item={item}
                key={`${index}/${items.length}`}
                onChange={item=>this.handleItemChange(index, item)}
                onRemove={()=>{this.removeItem(index)}}
            />
          )
        }
      </FormGroup>
    );
  }
}
