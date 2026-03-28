import React from "react";
import ReactDOM from "react-dom/client";
import { FlipProvider } from "react-easy-flip";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FlipProvider>
      <App />
    </FlipProvider>
  </React.StrictMode>,
);
