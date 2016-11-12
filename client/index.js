import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
// import { whyDidYouUpdate } from 'why-did-you-update';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configure from './store';
import App from './containers/App';
// whyDidYouUpdate(React);

const store = configure();
const history = syncHistoryWithStore(browserHistory, store);
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route
          component={App}
          path="/"
      />
    </Router>
  </Provider>,
  document.getElementById('root')
);
