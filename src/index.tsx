import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';

import store, { history } from './store';

import './index.css';
import MainContainer from './containers/Main.container';
import { YandexMetrika } from './components/YandexMetrika.component';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <IntlProvider locale={'ru'}>
        <Router history={history}>
          <MainContainer />
        </Router>
        <YandexMetrika />
      </IntlProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
