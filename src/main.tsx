import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { initializeApp } from './lib/init';

// Désactivation des service workers existants
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

// Initialisation de l'application
initializeApp().catch(console.error);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1B365D',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#C5A572',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#fff',
          },
        },
      }}
    />
    <App />
  </StrictMode>
);