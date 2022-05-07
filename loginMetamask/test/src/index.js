// https://github.com/MoralisWeb3/react-moralis
import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { MoralisProvider } from "react-moralis";

const theme = extendTheme({
  config: {
    inirialColorMode: 'dark'
  }
})

const appId = 'ubDzdHNV8MsCnI8Dsp0Vai6ZwzmZyRHq2dhZpd2d';
const serverUrl = 'https://kpzk5mc6vpt0.usemoralis.com:2053/server';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme = {theme}>
    <MoralisProvider appId = {appId} serverUrl = {serverUrl}>
        <App />
      </MoralisProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
