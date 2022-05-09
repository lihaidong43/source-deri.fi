import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {UseWalletProvider} from 'use-wallet'
import { Provider } from 'mobx-react';
import {positions, Provider as AlertProvider } from 'react-alert'
import MessageTemplate from './components/Message/MessageTemplate';
import { USE_WALLET_OPTIONS } from './utils/Constants';
import {HashRouter} from 'react-router-dom'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <UseWalletProvider {...USE_WALLET_OPTIONS}>
        <Provider >
          <AlertProvider position ={positions.TOP_RIGHT}  timeout ={5000}  offset ='30px'  template={MessageTemplate}>
            <App />
          </AlertProvider>
        </Provider>
      </UseWalletProvider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
