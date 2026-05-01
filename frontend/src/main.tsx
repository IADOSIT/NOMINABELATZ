// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Punto de entrada de la aplicación React
// ===================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'dayjs/locale/es-mx';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import { temaImperha } from './tema/temaImperha';
import './index.css';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={temaImperha}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
            <CssBaseline />
            <App />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
