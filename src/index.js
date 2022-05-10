import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import {UseWalletProvider} from 'use-wallet'
import { Provider } from 'mobx-react';
import {positions, Provider as AlertProvider } from 'react-alert'
import MessageTemplate from './components/Message/MessageTemplate';
import { USE_WALLET_OPTIONS } from './utils/Constants';
import {BrowserRouter} from 'react-router-dom'
import Intl from './model/Intl';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UseWalletProvider {...USE_WALLET_OPTIONS}>
        <Provider intl={Intl}>
          <AlertProvider position ={positions.TOP_RIGHT}  timeout ={5000}  offset ='30px'  template={MessageTemplate}>
            <App />
          </AlertProvider>
        </Provider>
      </UseWalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
