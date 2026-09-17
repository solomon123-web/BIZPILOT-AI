import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WorkspaceProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WorkspaceProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
