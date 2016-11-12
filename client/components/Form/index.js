import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment'
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock, Col } from 'react-bootstrap';

import style from './style.css';
import 'react-datepicker/dist/react-datepicker.css';

class PassengerForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            passengerName: '',
            passengerDepartment: '',
            country: '',
            numberOfPassengers: 1,
            departureDate: moment(),
            returnDate: moment(),
        };
    }

    handleNameChange = e => {
        this.setState({ passengerName: e.target.value });
    }

    handleCountryChange = e => {
        this.setState({ country: e.target.value });
    }

    handleDepartmentChange = e => {
        this.setState({ passengerDepartment: e.target.value });
    }

    handleNumberPassengersChange = e => {
        this.setState({ numberOfPassengers: e.target.value });
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

    render() {
        const {
            passengerName,
            passengerDepartment,
            country,
            numberOfPassengers,
            departureDate,
            returnDate,
        } = this.state;

        const numberOfDays = returnDate.diff(departureDate, 'days') + 1;
        return (
            <Form horizontal={true}>
                <h2>Travel's Details</h2>
                <FormGroup controlId="passenger-name">
                    <ControlLabel className="col-sm-3">Passenger Name</ControlLabel>
                    <Col sm={9}>
                    <FormControl
                        type="text"
                        placeholder="Enter name"
                        onChange={this.handleNameChange}
                        value={passengerName}
                    />
                    </Col>
                </FormGroup>
                <FormGroup controlId="passenger-department">
                    <ControlLabel className="col-sm-3">Passenger Department</ControlLabel>
                    <Col sm={9}>
                        <FormControl
                            type="text"
                            placeholder="Enter department"
                            onChange={this.handleDepartmentChange}
                            value={passengerDepartment}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="destination-country">
                    <ControlLabel className="col-sm-3">Destination Country</ControlLabel>
                    <Col sm={9}>
                        <FormControl
                            type="text"
                            placeholder="Enter country"
                            onChange={this.handleCountryChange}
                            value={country}
                        />
                        <HelpBlock>Enter city and country</HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup controlId="number-of-passengers">
                    <ControlLabel className="col-sm-3">Number of Passengers</ControlLabel>
                    <Col sm={9}>
                        <FormControl
                            type="number"
                            onChange={this.handleNumberPassengersChange}
                            value={numberOfPassengers}
                            min={0}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="departure-date">
                    <ControlLabel className="col-sm-3">Departure Date</ControlLabel>
                    <Col sm={9}>
                        <DatePicker
                            customInput={<DatePickerButton />}
                            onChange={this.handleDepartureChange}
                            selectsStart
                            startDate={departureDate}
                            endDate={returnDate}
                            selected={departureDate} />
                    </Col>
                </FormGroup>
                <FormGroup controlId="return-date">
                    <ControlLabel className="col-sm-3">Return Date</ControlLabel>
                    <Col sm={9}>
                        <DatePicker
                            customInput={<DatePickerButton />}
                            onChange={this.handleReturnChange}
                            selectsEnd
                            startDate={departureDate}
                            endDate={returnDate}
                            selected={returnDate} />
                    </Col>
                </FormGroup>
                <FormGroup controlId="number-of-days">
                    <ControlLabel className="col-sm-3">Number of Days</ControlLabel>
                    <Col sm={9}>
                        <FormControl.Static>{numberOfDays}</FormControl.Static>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
};

export default PassengerForm;

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
