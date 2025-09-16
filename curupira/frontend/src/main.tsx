import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import { queryClient } from '~/clients'
import App from './App.tsx'
import AxiosInterceptor from './clients/http/AxiosInterceptor'
import { AuthProvider } from './contexts/Auth.context.tsx'
import { ToastProvider } from './hooks/useToast.hook.tsx'
import i18n from './i18n/i18n.ts'
import './index.css'
import { createCustomTheme } from './theme/createCustomTheme.js'

if (import.meta.env.VITE_ENV === 'PROD' || import.meta.env.VITE_ENV === 'HML') {
  console.log = () => { }
  console.warn = () => { }
  console.error = () => { }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router basename={import.meta.env.VITE_HTTP_BASENAME}>
            <ThemeProvider theme={createCustomTheme()}>
              <AuthProvider>
                <CssBaseline />
                <AxiosInterceptor>
                  <App />
                </AxiosInterceptor>
              </AuthProvider>
            </ThemeProvider>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>,
)
