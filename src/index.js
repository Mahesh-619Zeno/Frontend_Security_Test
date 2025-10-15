import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import './index.css'; // Optional: for global styles
import App from './App';
import reportWebVitals from './reportWebVitals'; // Optional: for performance monitoring

// Get the root DOM element where the React app will be mounted
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component inside React's StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();