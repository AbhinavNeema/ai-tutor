import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

// helper component to protect routes
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* login */}
        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/chat" replace />
              : <LoginPage />
          }
        />

        {/* chat list */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* specific chat */}
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* default redirect */}
        <Route
          path="/"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />

        {/* fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
