import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "./main.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./Redux/store.ts";
import ErrorBoundary from "./components/Common/common4All/ErrorBoundary.tsx";
import { PersistGate } from "redux-persist/integration/react";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          <App />
          </PersistGate>
        </Provider>
      </LocalizationProvider>
    </ErrorBoundary>
  </StrictMode>
);
