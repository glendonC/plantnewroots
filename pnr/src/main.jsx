import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { AuthProvider } from './contexts/AuthContext';
import { LevelProvider } from './contexts/LevelContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LevelProvider> 
          <App />
        </LevelProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);