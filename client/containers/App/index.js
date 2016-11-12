import React, { Component, PropTypes } from 'react';
import { Col, Nav, NavItem } from 'react-bootstrap';
// import classnames from 'classnames';
// import request from 'superagent';

// import Navbar from '../../components/Navbar';
// import style from './style.css';
import PassengerForm from '../../components/Form/index';

class App extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;

    return (
        <div>
            <Col sm={2}>
                <Nav bsStyle="pills" stacked={true} activeKey={1} onSelect={this.handleSelect}>
                    <NavItem eventKey={1}>Travel's Details</NavItem>
                    <NavItem eventKey={2}>Exchange Rates</NavItem>
                    <NavItem eventKey={3}>Expenses</NavItem>
                </Nav>
            </Col>
            <Col sm={10}>
                <PassengerForm />
            </Col>
        </div>
    );
  }
}

export default App;
