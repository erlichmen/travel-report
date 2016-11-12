import React, { Component } from 'react';
import { Col, Nav, NavItem } from 'react-bootstrap';

import './style.css';
import TravelDetails from '../../components/Form/index';

const DEFAULT_STAGE = 'DETAILS';
const RATES = 'RATES';
const EXPENSES = 'EXPENSES';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      stage: DEFAULT_STAGE,
      data: {},
    };
  }

  handleSelect = key => {
    this.setState({ stage: key });
  }

  handleTravelsDetailsSubmit = data => {
    const { data: oldData } = this.state;

    const newData = Object.assign({}, oldData, { details: data });
    this.setState({ data: newData, stage: RATES });
  }

  render() {
    const { stage, data } = this.state;

    return (
        <div>
            <Col sm={2}>
                <Nav
                    activeKey={stage}
                    bsStyle="pills"
                    onSelect={this.handleSelect}
                    stacked
                >
                    <NavItem eventKey={DEFAULT_STAGE}>Travel's Details</NavItem>
                    <NavItem eventKey={RATES}>Exchange Rates</NavItem>
                    <NavItem eventKey={EXPENSES}>Expenses</NavItem>
                </Nav>
            </Col>
            <Col sm={10}>
                { stage === DEFAULT_STAGE &&
                <TravelDetails
                    details={data.details}
                    onSubmit={this.handleTravelsDetailsSubmit}
                />
                }
                { stage === RATES &&
                  <div>Rates</div>
                }
                { stage === EXPENSES &&
                  <div>Expenses</div>
                }
            </Col>
        </div>
    );
  }
}

export default App;
