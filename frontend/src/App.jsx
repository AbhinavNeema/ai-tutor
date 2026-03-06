import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// 🔹 Handles LMS token → converts to AI Tutor token
function TokenHandler() {

  const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const lmsToken = params.get("token");

    if (!lmsToken) return;

    async function exchangeToken() {

      try {

        const res = await fetch(
          "https://ai-tutor-1bp0.onrender.com/api/sso/sso-login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${lmsToken}`
            }
          }
        );

        const data = await res.json();

        if (data.token) {

          // store AI tutor token
          localStorage.setItem("token", data.token);

          // clean URL
          window.location.replace("/chat");

        } else {

          console.error("SSO login failed", data);

        }

      } catch (err) {

        console.error("SSO error", err);

      }

    }

    exchangeToken();

  }, [location]);

  return null;

}


function App() {

  const token = localStorage.getItem("token");

  return (

    <BrowserRouter>

      {/* capture token from URL */}
      <TokenHandler />

      <Routes>

        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/chat" replace />
              : <LoginPage />
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;