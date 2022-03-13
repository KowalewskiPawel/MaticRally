import React from 'react';
import ReactDOM from 'react-dom';
import { MoralisProvider } from "react-moralis";
import "./index.css";
import App from './App';

const {REACT_APP_ID, REACT_APP_URL} = process.env;

ReactDOM.render(
  <MoralisProvider appId={REACT_APP_ID} serverUrl={REACT_APP_URL} >
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);
