import React, { Component, PropTypes } from 'react';
import { Col, Nav, NavItem } from 'react-bootstrap';
// import classnames from 'classnames';
import request from 'superagent';
import mockData from '../../../docs/structure';

// import Navbar from '../../components/Navbar';
// import style from './style.css';
import PassengerForm from '../../components/Form/index';

const sturcture = {
};

class App extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  handleRequest(){
    request.post('/api/export')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(mockData)
    .end((err, res)=>{
      if (err) {
        console.error(err);
      }else{
        console.log(res.body);
      }
    });
  }

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
            <button onClick={this.handleRequest}>REQUEST</button>
      </div>
    );
  }
}

export default App;
