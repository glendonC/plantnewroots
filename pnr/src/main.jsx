import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import { AuthProvider } from './contexts/AuthContext';
import { LevelLanguageProvider } from './contexts/LevelLanguageContext';
import { StoryProvider } from './contexts/StoryContext.jsx';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LevelLanguageProvider>
        <StoryProvider>
          <App />
        </StoryProvider>
        </LevelLanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);