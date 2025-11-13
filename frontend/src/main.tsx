import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { LoanAppProvider } from "./providers/LoanAppProvider";
import ErrorBoundary from "./ui/ErrorBoundary";
import App from "./App";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3", // your main blue
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
  fonts: {
    heading: `'Segoe UI', sans-serif`,
    body: `'Segoe UI', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.700",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <LoanAppProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LoanAppProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
