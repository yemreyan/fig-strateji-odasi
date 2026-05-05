import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageProvider } from "./lib/LanguageContext";
import { StrategyApp } from "./components/StrategyApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <StrategyApp />
    </LanguageProvider>
  </React.StrictMode>
);
