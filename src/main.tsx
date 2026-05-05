import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from "./features/Store/store.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "14px",
          },
        }}
      />
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter >
  </StrictMode >,
)
