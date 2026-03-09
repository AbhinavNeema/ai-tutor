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
// 🔹 Handles token from URL
function TokenHandler() {

  const [loading, setLoading] = React.useState(false);

  const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const lmsToken = params.get("token");

    console.log("🔹 URL params:", location.search);
    console.log("🔹 LMS Token received:", lmsToken);

    if (!lmsToken) {
      console.log("❌ No LMS token found");
      return;
    }

    setLoading(true);

    async function exchangeToken() {

      try {

        console.log("🚀 Sending LMS token to backend...");

        const res = await fetch(
          "https://ai-tutor-1bp0.onrender.com/api/sso/sso",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${lmsToken}`
            }
          }
        );

        console.log("🔹 Response status:", res.status);

        const data = await res.json();

        console.log("🔹 Backend response:", data);

        if (data.token) {

          console.log("✅ AI Tutor token received:", data.token);

          localStorage.setItem("token", data.token);

          console.log("💾 Token saved in localStorage");

          window.location.replace("/chat");

        } else {

          console.log("❌ No token returned from backend");
          setLoading(false);
        }

      } catch (err) {

        console.error("❌ SSO error:", err);

      }

    }

    exchangeToken();

  }, [location]);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "600"
      }}>
        🔐 Verifying LMS session...
      </div>
    );
  }

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