import React, { Component, PropTypes } from 'react';
import { Form, Button} from 'react-bootstrap';
import ExpenseGroup from './ExpenseGroup';

export default class Expenses extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);
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

  handleItemsChange(itemsName, items){
    this.setState({
      [itemsName]: items,
    });
  }

  isFormValid(){
    return true;
  }

  handleSubmitClick(){
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
    });
  }

  render(){
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
              items={flights}
              onChange={(flights)=> this.handleItemsChange('flights', flights)}
              title="Flights"
          />
          <ExpenseGroup
              items={hotel}
              onChange={(hotel)=> this.handleItemsChange('hotel', hotel)}
              title="Hotels"
          />
          <ExpenseGroup
              items={rentalCar}
              onChange={(rentalCar)=> this.handleItemsChange('rentalCar', rentalCar)}
              title="Rental Car"
          />
          <ExpenseGroup
              items={publicTransportation}
              onChange={(publicTransportation)=> this.handleItemsChange('publicTransportation', publicTransportation)}
              title="Public Transportation"
          />
          <ExpenseGroup
              items={comunication}
              onChange={(comunication)=> this.handleItemsChange('comunication', comunication)}
              title="Comunication"
          />
          <ExpenseGroup
              items={conference}
              onChange={(conference)=> this.handleItemsChange('conference', conference)}
              title="Conference/ Exhibition"
          />
          <ExpenseGroup
              items={other}
              onChange={(other)=> this.handleItemsChange('other', other)}
              title="Other"
          />

        <Button
            bsStyle="primary"
            className="pull-right"
            disabled={!this.isFormValid()}
            onClick={::this.handleSubmitClick}
        >Continue</Button>
      </Form>
    );
  }
}
