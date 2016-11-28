import React, { Component } from 'react';
import request from 'superagent';
// import mockData from '../../../docs/structure';
import { Col, Nav, NavItem } from 'react-bootstrap';

import './style.css';
import TravelDetails from '../../components/TravelDetails';
import ExchangeRates from '../../components/Rates';
import Expenses from '../../components/Expenses';

const DEFAULT_STAGE = 'DETAILS';
const RATES = 'RATES';
const EXPENSES = 'EXPENSES';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      stage: DEFAULT_STAGE,
      data: {},
    };
  }

  saveData(blob, fileName) {
    let a = document.createElement('a');
    a.style = 'display: none';
    document.body.appendChild(a);
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  handleSendRequest(){
    request.post('/api/post')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    // .send(mockData)
    .send(this.state.data)
    .end((err, res)=>{
      if (err) {
        console.error(err);
      }else{
        console.log(res.body);
      }
    });
  }

  handleExportRequest(){
    request.post('/api/export')
    .set('Content-Type', 'application/json')
    .responseType('blob')
    // .send(mockData)
    .send(this.state.data)
    .end((err, res)=>{
      if (err) {
        console.error(err);
      }else{
        // console.log(res.body);
        const {details} = this.state.data;
        const datesString = `${new Date(details.departureDate).toLocaleDateString().replace(/\//g,'_')}-${new Date(details.returnDate).toLocaleDateString().replace(/\//g,'_')}`;

        this.saveData(res.xhr.response, `${details.name} ${datesString}.xlsx`);
      }
    });
  }

  handleSelect = key => {
    this.setState({ stage: key });
  }

  handleTravelsDetailsSubmit(data) {
    const { data: oldData } = this.state;

    const newData = Object.assign({}, oldData, { details: data });
    this.setState({ data: newData, stage: RATES });
  }

  handleRatesSubmit(data) {
    const { data: oldData } = this.state;

    const newData = Object.assign({}, oldData, { currencyRates: data });
    this.setState({ data: newData, stage: EXPENSES });
  }

  handleExpensesSubmit(data){
    const { data: oldData } = this.state;

    const newData = Object.assign({}, oldData, { expenses: data });
    this.setState({ data: newData, stage: DEFAULT_STAGE });
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
                    <NavItem
                      onClick={::this.handleExportRequest}
                    >
                      Download Travel Report
                    </NavItem>
                    <NavItem
                      onClick={::this.handleSendRequest}
                    >
                      Submit Travel Report
                    </NavItem>
                </Nav>
            </Col>
            <Col sm={10}>
                { stage === DEFAULT_STAGE &&
                <TravelDetails
                    details={data.details}
                    onSubmit={::this.handleTravelsDetailsSubmit}
                />
                }
                { stage === RATES &&
                  <ExchangeRates
                      onSubmit={::this.handleRatesSubmit}
                      rates={data.currencyRates}
                  />
                }
                { stage === EXPENSES &&
                  <Expenses
                      expenses={data.expenses}
                      onSubmit={::this.handleExpensesSubmit}
                  />
                }
            </Col>
        </div>
    );
  }
}
