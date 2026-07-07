import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { background: '#2A2420', color: '#FFF5EC', borderRadius: '12px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#FFF5EC' } },
          error: { iconTheme: { primary: '#A8404B', secondary: '#FFF5EC' } }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
