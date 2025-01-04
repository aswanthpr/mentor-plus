import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './Redux/store.ts'
import ErrorBoundary from './components/Common/ErrorBoundary.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ErrorBoundary>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
