import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './Redux/store.ts'
// import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId={`605574965269-hd4675h5h3c1ucoui1huv9jbp4c3nre5.apps.googleusercontent.com`}> */}
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    {/* </GoogleOAuthProvider> */}
  </StrictMode>,
)
