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
  "697862016586-trrbp8c76hmiuin7h4snjh30asdjtt8c.apps.googleusercontent.com";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={clientId}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);