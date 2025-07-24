// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChallengeProvider } from "./context/ChallengeContext";
import { AchievementProvider } from "./context/AchievementContext";  // <-- AÑADIR IMPORT

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChallengeProvider>
          <AchievementProvider>  
            <App />
          </AchievementProvider>
        </ChallengeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
