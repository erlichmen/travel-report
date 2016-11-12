import React, { Component, PropTypes } from 'react';
import { Col, Nav, NavItem } from 'react-bootstrap';
// import classnames from 'classnames';
// import request from 'superagent';

// import Navbar from '../../components/Navbar';
// import style from './style.css';
import PassengerForm from '../../components/Form/index';

const sturcture = {
};

class App extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;

    return (
        <div>
            <Col sm={2}>
                <Nav
                    activeKey={1}
                    bsStyle="pills"
                    onSelect={this.handleSelect}
                    stacked={true}
                >
                    <NavItem eventKey={1}>Travel's Details</NavItem>
                    <NavItem eventKey={2}>Exchange Rates</NavItem>
                    <NavItem eventKey={3}>Expenses</NavItem>
                </Nav>
            </Col>
            <Col sm={10}>
                <PassengerForm details={sturcture.details} onSubmit={value => console.log(value)} />
            </Col>
        </div>
    );
  }
}

export default App;
