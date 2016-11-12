import React, { Component, PropTypes } from 'react';
// import classnames from 'classnames';
// import request from 'superagent';

// import Navbar from '../../components/Navbar';
// import style from './style.css';

class App extends Component {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;

    return (
      <div>
        hi
      </div>
    );
  }
}

export default App;
