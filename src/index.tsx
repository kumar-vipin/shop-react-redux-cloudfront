import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import axios from "axios";
import API_PATHS from "./constants/apiPaths";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.config.url.indexOf(API_PATHS.import) !== -1) {
      if(localStorage.getItem('authorizationToken')) {
        alert('403 Forbidden: The server understood the request, but it refuses to authorize it. The client does not have the necessary permissions to access the resource.');
      } else {
        alert('401 Unauthorized: The request has not been applied because it lacks valid authentication credentials for the target resource.');
      }
      const { message } = error;
      alert(`Import error occured: ${message}`);
    }
    return Promise.reject(error);
  }
);

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
