import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Form, FormGroup, FormControl, ControlLabel, Button, Col } from 'react-bootstrap';

import style from './style.css';
import 'react-datepicker/dist/react-datepicker.css';

const isValidText = text => {
  return (Boolean(text) && Boolean(text.trim()));
};

const getTextValidationState = (text, pristine) => {
  if (!pristine) {
    return null;
  }
  return isValidText(text) ? 'success' : 'error';
};

class TravelDetails extends Component {
  static propTypes = {
    details: PropTypes.shape({
      name: PropTypes.string,
      department: PropTypes.string,
      destination: PropTypes.shape({
        country: PropTypes.string,
        city: PropTypes.string,
      }),
      departureDate: PropTypes.number,
      returnDate: PropTypes.number,
      purpose: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);

    const { details } = props;
    if (!details) {
      this.state = {
        city: {
          pristine: false,
          value: '',
        },
        country: {
          pristine: false,
          value: '',
        },
        departureDate: moment(),
        numberOfPassengers: 1,
        passengerDepartment: {
          pristine: false,
          value: '',
        },
        passengerName: {
          pristine: false,
          value: '',
        },
        purpose: {
          pristine: false,
          value: '',
        },
        returnDate: moment(),
      };
    } else {
      const { name, department, destination, numberOfPassengers, departureDate, returnDate, purpose } = details;
      this.state = {
        city: {
          pristine: true,
          value: destination.city,
        },
        country: {
          pristine: true,
          value: destination.country,
        },
        departureDate: moment(departureDate),
        numberOfPassengers,
        passengerDepartment: {
          pristine: true,
          value: department,
        },
        passengerName: {
          pristine: true,
          value: name,
        },
        purpose: {
          pristine: true,
          value: purpose,
        },
        returnDate: moment(returnDate),
      };
    }
  }

  handleNameChange = e => {
    this.setState({ passengerName: {
      pristine: true,
      value: e.target.value,
    },
    });
  }

  handleCountryChange = e => {
    this.setState({ country: {
      pristine: true,
      value: e.target.value,
    },
    });
  }

  handleCityChange = e => {
    this.setState({ city: {
      pristine: true,
      value: e.target.value,
    },
    });
  }

  handleDepartmentChange = e => {
    this.setState({ passengerDepartment: {
      pristine: true,
      value: e.target.value,
    },
    });
  }

  handlePurposeChange = e => {
    this.setState({ purpose: {
      pristine: true,
      value: e.target.value,
    },
    });
  }

  handleNumberPassengersChange = e => {
    this.setState({ numberOfPassengers: parseInt(e.target.value) });
  }

  handleDepartureChange = date => {
    const { returnDate } = this.state;
    if (date.isAfter(returnDate)) {
      return this.setState({ departureDate: returnDate, returnDate: date });
    }
    this.setState({ departureDate: date });
  }

  handleReturnChange = date => {
    const { departureDate } = this.state;
    if (date.isBefore(departureDate)) {
      return this.setState({ returnDate: departureDate, departureDate: date });
    }
    this.setState({ returnDate: date });
  }

  isFormValid = () => {
    const { passengerName, passengerDepartment, country, city, purpose } = this.state;
    return isValidText(passengerName.value) &&
           isValidText(passengerDepartment.value) &&
           isValidText(city.value) &&
           isValidText(country.value) &&
           isValidText(purpose.value);
  }

  handleSubmitClick = () => {
    const { onSubmit } = this.props;
    if (!this.isFormValid()) {
      return;
    }

    const {
      passengerName: { value: name },
      passengerDepartment: { value: department },
      city: { value: city },
      country: { value: country },
      numberOfPassengers,
      departureDate,
      returnDate,
      purpose: { value: purpose },
    } = this.state;

    onSubmit({
      name,
      department,
      destination: {
        city,
        country,
      },
      numberOfPassengers,
      departureDate: departureDate.valueOf(),
      returnDate: returnDate.valueOf(),
      purpose,
    });
  }

  render() {
    const {
      passengerName,
      passengerDepartment,
      city,
      country,
      numberOfPassengers,
      departureDate,
      returnDate,
      purpose,
    } = this.state;

    const numberOfDays = returnDate.diff(departureDate, 'days') + 1;
    return (
      <Form horizontal>
        <h2>Travel's Details</h2>
        <FormGroup
            controlId="passenger-name"
            validationState={getTextValidationState(passengerName.value, passengerName.pristine)}
        >
            <ControlLabel className="col-sm-4">Passenger Name</ControlLabel>
            <Col sm={8}>
            <FormControl
                onChange={this.handleNameChange}
                placeholder="Enter name"
                required
                type="text"
                value={passengerName.value}
            />
            </Col>
        </FormGroup>
        <FormGroup
            controlId="passenger-department"
            validationState={getTextValidationState(passengerDepartment.value, passengerDepartment.pristine)}
        >
            <ControlLabel className="col-sm-4">Passenger Department</ControlLabel>
            <Col sm={8}>
                <FormControl
                    onChange={this.handleDepartmentChange}
                    placeholder="Enter department"
                    type="text"
                    value={passengerDepartment.value}
                />
            </Col>
        </FormGroup>
        <label className="control-label col-sm-4">Destination</label>
        <FormGroup
            className={style.destinationGroup}
            controlId="destination-country"
            validationState={getTextValidationState(country.value, country.pristine)}
        >
            <FormControl
                onChange={this.handleCountryChange}
                placeholder="Enter country"
                type="text"
                value={country.value}
            />
        </FormGroup>
        <FormGroup
            className={style.destinationGroup}
            controlId="destination-city"
            validationState={getTextValidationState(city.value, city.pristine)}
        >
            <FormControl
                onChange={this.handleCityChange}
                placeholder="Enter city"
                type="text"
                value={city.value}
            />
        </FormGroup>
        <FormGroup controlId="number-of-passengers">
            <ControlLabel className="col-sm-4">Number of Passengers</ControlLabel>
            <Col sm={8}>
                <FormControl
                    min={0}
                    onChange={this.handleNumberPassengersChange}
                    type="number"
                    value={numberOfPassengers}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="departure-date">
            <ControlLabel className="col-sm-4">Departure Date</ControlLabel>
            <Col sm={8}>
                <DatePicker
                    customInput={<DatePickerButton />}
                    endDate={returnDate}
                    onChange={this.handleDepartureChange}
                    selected={departureDate}
                    selectsStart
                    startDate={departureDate}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="return-date">
            <ControlLabel className="col-sm-4">Return Date</ControlLabel>
            <Col sm={8}>
                <DatePicker
                    customInput={<DatePickerButton />}
                    endDate={returnDate}
                    onChange={this.handleReturnChange}
                    selected={returnDate}
                    selectsEnd
                    startDate={departureDate}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="number-of-days">
            <ControlLabel className="col-sm-4">Number of Days</ControlLabel>
            <Col sm={8}>
                <FormControl.Static>{numberOfDays}</FormControl.Static>
            </Col>
        </FormGroup>
        <FormGroup
            controlId="purpose"
            validationState={getTextValidationState(purpose.value, purpose.pristine)}
        >
            <ControlLabel className="col-sm-4">Purpose</ControlLabel>
            <Col sm={8}>
            <FormControl
                onChange={this.handlePurposeChange}
                placeholder="Enter purpose"
                type="text"
                value={purpose.value}
            />
            </Col>
        </FormGroup>
        <Button
            bsStyle="primary"
            className="pull-right"
            disabled={!this.isFormValid()}
            onClick={this.handleSubmitClick}
        >Continue</Button>
      </Form>
    );
  }
}

export default TravelDetails;

const DatePickerButton = React.createClass({
    propTypes: {
        onClick: PropTypes.func,
        value: PropTypes.string
    },

    render () {
        return (
            <Button onClick={this.props.onClick} >
                {this.props.value}
            </Button>
        )
    }
});
