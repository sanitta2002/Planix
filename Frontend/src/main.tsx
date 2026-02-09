import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import { persistor, Store } from './store/Store.ts'
import { PersistGate } from 'redux-persist/integration/react'


export const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store} >
      <PersistGate loading={null} persistor={persistor}>

        <QueryClientProvider  client={queryClient}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

            <BrowserRouter>
              <App />
            </BrowserRouter>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </PersistGate>

    </Provider>
  </StrictMode >,
)
