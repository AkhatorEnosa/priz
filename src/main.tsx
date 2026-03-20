// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import ApiErrorBoundary from './components/ApiErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ApiErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ApiErrorBoundary>
  // </StrictMode>,
)
