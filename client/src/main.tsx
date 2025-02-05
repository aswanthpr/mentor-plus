import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css";
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './Redux/store.ts'
import ErrorBoundary from './components/Common/common4All/ErrorBoundary.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ErrorBoundary>
    <Provider store={store}>

    <App />
  
    </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
