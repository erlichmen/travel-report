import React, { Component } from 'react';
import request from 'superagent';
// import mockData from '../../../docs/multiCurrency';
import { Col, Nav, NavItem, Modal, Button } from 'react-bootstrap';

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

  handleSendRequest(data){
    // data = mockData;
    request.post('/api/post')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(data)
    .end((err, res)=>{
      if (res && res.body && !res.body.err) {
        this.setState({
          alert:{
            type: 'success',
            title: 'Travel Report Sent!',
            message:`Great doing buisness with you,
            hope you had a nice trip and that you enjoyed filling out the new report.
            `,
          },
        });
      }else{
        console.error(err || res.body.err);
        this.setState({
          alert:{
            type: 'danger',
            title: 'Something went wrong!',
            message:`It might be the server but,
            it also just might be that one of the parameters you entered is just no good,
            look it over and retry or tell Soophie that something wierd is going on.
            (not that I'm bleaming or anything...)
            `,
          },
        });
      }
    });
  }

  handleExportRequest(data){
    // data = mockData;
    request.post('/api/export')
    .set('Content-Type', 'application/json')
    .responseType('blob')
    .send(data)
    .end((err, res)=>{
      if (err) {
        console.error(err);
        this.setState({
          alert:{
            type: 'danger',
            title: 'Something went wrong!',
            message:`It might be the server but,
            it also just might be that one of the parameters you entered is just no good,
            look it over and retry or tell Soophie that something wierd is going on.
            (not that I'm bleaming or anything...)
            `,
          },
        });
      }else{
        const {details} = data;
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

  handleRatesSubmit(data, back) {
    const { data: oldData } = this.state;

    const newData = Object.assign({}, oldData, { currencyRates: data });
    this.setState({ data: newData, stage: back?DEFAULT_STAGE:EXPENSES });
  }

  handleExpensesSubmit(data, type){
    const { data: oldData } = this.state;
    const newData = Object.assign({}, oldData, { expenses: data });

    if (type==='back'){
      this.setState({ data: newData, stage: RATES });
    }else if (type==='submit') {
      this.handleSendRequest(newData);
    }else if (type==='download') {
      this.handleExportRequest(newData);
    }
  }

  changeCurrency(currency){
    const { data: oldData } = this.state;
    const {currencyRates} = oldData;

    const newCurrencyRates = Object.assign({}, currencyRates, { usd: currency.usd });
    const newData = Object.assign({}, oldData, { currencyRates: newCurrencyRates });

    this.setState({ data: newData });
  }

  hideAlert(){
    this.setState({
      alert: undefined,
    });
  }

  render() {
    const { stage, data, alert } = this.state;
    const currencies = data.currencyRates? Object.keys(data.currencyRates).filter(key=>data.currencyRates[key]!==undefined).concat(['nis']):[];

    return (
        <div>
            <Col sm={2}>
                <Nav
                    activeKey={stage}
                    bsStyle="pills"
                    onSelect={this.handleSelect}
                    stacked
                >
                    <NavItem
                        disabled
                        eventKey={DEFAULT_STAGE}
                    >
                      Travel's Details
                    </NavItem>
                    <NavItem
                        disabled
                        eventKey={RATES}
                    >
                      Exchange Rates
                    </NavItem>
                    <NavItem
                        disabled
                        eventKey={EXPENSES}
                    >
                      Expenses
                    </NavItem>
                </Nav>
            </Col>
            <Col sm={10}>
              <Modal onHide={::this.hideAlert} show={alert!==undefined}>
                <Modal.Header bsClass={`modal-header ${alert&&`alert-${alert.type}`}`} closeButton>
                  <Modal.Title>{alert&&alert.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {alert&&alert.message.split('\n').map((line, index)=><p key={index}>{line}</p>)}
                </Modal.Body>
                <Modal.Footer bsClass={`modal-footer ${alert&&`alert-${alert.type}`}`}>
                  <Button onClick={::this.hideAlert}>Close</Button>
                </Modal.Footer>
              </Modal>
                { stage === DEFAULT_STAGE &&
                <TravelDetails
                    changeCurrency={::this.changeCurrency}
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
                      currencies={currencies}
                      expenses={data.expenses}
                      onSubmit={::this.handleExpensesSubmit}
                  />
                }
            </Col>
        </div>
    );
  }
}
