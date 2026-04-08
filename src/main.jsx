import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';
import 'bootstrap/dist/css/bootstrap.min.css';

// Registra el service worker de la PWA para permitir cache y comportamiento instalable.
registerSW();

// Punto de entrada de React: monta toda la app en el div #root del index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
