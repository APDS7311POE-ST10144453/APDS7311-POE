/**
 * Entry point of the React application.
 * 
 * This file sets up the root of the React application and renders the main App component
 * wrapped with StrictMode and Router components.
 * 
 * - `StrictMode`: A tool for highlighting potential problems in an application.
 * - `Router`: Provides routing capabilities to the application.
 * 
 * The `createRoot` function is used to create a root for the React application and 
 * render the App component into the DOM element with the id "root".
 * 
 * @file main.tsx
 * @module Main
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
