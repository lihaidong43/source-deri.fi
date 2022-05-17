import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import BetIt from './pages/BetIt';
import { inject, observer } from 'mobx-react';
import PageRouter from './pages/PageRouter';
import { DeriEnv } from './web3';

DeriEnv.set('prod')

function App({intl}) {
  return (
    <div className="App">
      <PageRouter intl={intl}></PageRouter>
    </div>
  );
}

export default inject("intl")(observer(App));
