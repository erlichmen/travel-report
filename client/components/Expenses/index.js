import React, { Component, PropTypes } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import ExpenseGroup from './ExpenseGroup';

export default class Expenses extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string),
    expenses: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);
    if (props.expenses){
      this.state = {
        flights:props.expenses.flights || [],
        hotel:props.expenses.hotel || [],
        rentalCar:props.expenses.rentalCar || [],
        publicTransportation:props.expenses.publicTransportation || [],
        comunication:props.expenses.comunication || [],
        conference:props.expenses.conference || [],
        other:props.expenses.other || [],
      };
    }else{
      this.state = {
        flights:[],
        hotel:[],
        rentalCar:[],
        publicTransportation:[],
        comunication:[],
        conference:[],
        other:[],
      };
    }
  }

  handleItemsChange(itemsName, items){
    this.setState({
      [itemsName]: items,
    });
  }

  isFormValid(){
    return true;
  }

  handleSubmitClick(type){
    const { onSubmit } = this.props;
    const {
      flights,
      hotel,
      rentalCar,
      publicTransportation,
      comunication,
      conference,
      other,
    } = this.state;

    onSubmit({
      flights,
      hotel,
      rentalCar,
      publicTransportation,
      comunication,
      conference,
      other,
    }, type);
  }

  render(){
    const {currencies} = this.props;
    const {
      flights,
      hotel,
      rentalCar,
      publicTransportation,
      comunication,
      conference,
      other,
    } = this.state;

    return (
      <Form horizontal>
        <h2>Expenses</h2>
          <ExpenseGroup
              currencies={currencies}
              items={flights}
              onChange={(flights)=> this.handleItemsChange('flights', flights)}
              title="Flights"
          />
          <ExpenseGroup
              currencies={currencies}
              items={hotel}
              onChange={(hotel)=> this.handleItemsChange('hotel', hotel)}
              title="Hotels"
          />
          <ExpenseGroup
              currencies={currencies}
              items={rentalCar}
              onChange={(rentalCar)=> this.handleItemsChange('rentalCar', rentalCar)}
              title="Rental Car"
          />
          <ExpenseGroup
              currencies={currencies}
              items={publicTransportation}
              onChange={(publicTransportation)=> this.handleItemsChange('publicTransportation', publicTransportation)}
              title="Public Transportation"
          />
          <ExpenseGroup
              currencies={currencies}
              items={comunication}
              onChange={(comunication)=> this.handleItemsChange('comunication', comunication)}
              title="Comunication"
          />
          <ExpenseGroup
              currencies={currencies}
              items={conference}
              onChange={(conference)=> this.handleItemsChange('conference', conference)}
              title="Conference/ Exhibition"
          />
          <ExpenseGroup
              currencies={currencies}
              items={other}
              onChange={(other)=> this.handleItemsChange('other', other)}
              title="Other"
          />

        <Row>
          <Button
              bsStyle="info"
              className="pull-left"
              disabled={!this.isFormValid()}
              style={{margin:'0 5px'}}
              onClick={()=>::this.handleSubmitClick('back')}
          >
            Back
          </Button>
          <Button
              bsStyle="primary"
              className="pull-right"
              disabled={!this.isFormValid()}
              style={{margin:'0 5px'}}
              onClick={()=>::this.handleSubmitClick('submit')}
          >
            Submit to Soophie
          </Button>
          <Button
              bsStyle="primary"
              className="pull-right"
              disabled={!this.isFormValid()}
              style={{margin:'0 5px'}}
              onClick={()=>::this.handleSubmitClick('download')}
          >
            Download
          </Button>
        </Row>
      </Form>
    );
  }
}
