import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

setTimeout(() => window.scrollTo(0, 0), 0);
setTimeout(() => window.scrollTo(0, 0), 100);
setTimeout(() => window.scrollTo(0, 0), 500);