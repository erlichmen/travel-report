import React, { Component, PropTypes } from 'react';
// import classnames from 'classnames';
import request from 'superagent';
import mockData from '../../../docs/structure';

// import Navbar from '../../components/Navbar';
// import style from './style.css';

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
        <button onClick={this.handleRequest}>REQUEST</button>
        <div>
          hi
        </div>
      </div>
    );
  }
}

export default App;
