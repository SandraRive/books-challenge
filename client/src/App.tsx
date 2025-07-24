// src/App.tsx
import React, { JSX, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { token } = useContext(AuthContext);

  // Componente inline para proteger rutas privadas
  const Private = ({ children }: { children: JSX.Element }) =>
    token ? children : <Navigate to="/login" replace />;

  return (
    <div className="container">
      <Routes>
        {/* Redirige la raíz según estado de autenticación */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route
          path="/ranking"
          element={
            <Private>
              <Ranking />
            </Private>
          }
        />
        <Route
          path="/profile"
          element={
            <Private>
              <ProfilePage />
            </Private>
          }
        />

        {/* Catch-all: redirige a raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
