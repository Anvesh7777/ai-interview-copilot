import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  BrowserRouter,
} from "react-router-dom";

const clientId =
  import.meta.env
    .VITE_GOOGLE_CLIENT_ID;

if (
  !clientId
) {
  throw new Error(
    "VITE_GOOGLE_CLIENT_ID is missing"
  );
}

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        clientId
      }
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);