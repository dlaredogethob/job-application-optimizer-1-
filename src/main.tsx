import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './components/AppProvider';
import { router } from './router';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { FixedLaredoLogo } from './components/LaredoLogo';

// Mock data toggle (can be enhanced for environment detection)
const MOCK_DATA_ENABLED = true;
if (MOCK_DATA_ENABLED) {
  console.log('Running with mock data enabled');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
      <FixedLaredoLogo />
    </AppProvider>
  </React.StrictMode>
);
