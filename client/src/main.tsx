import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "./main.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import ErrorBoundary from "./components/Common/common4All/ErrorBoundary.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <App />
        </Provider>
      </LocalizationProvider>
    </ErrorBoundary>
  </StrictMode>
);
