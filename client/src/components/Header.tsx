// src/components/Header.tsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        BooksChallenge
      </Link>

      <nav className="space-x-4">
        {/* Si no hay token, muestra Iniciar sesión / Regístrate */}
        {!token && (
          <>
            <Link
              to="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Regístrate
            </Link>
          </>
        )}

        {/* Si hay token, muestra Logout */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
}

