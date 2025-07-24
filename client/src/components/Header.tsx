// src/components/Header.tsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          BooksChallenge
        </Link>

        {/* Botón hamburguesa en xs/sm */}
        <button
          className="sm:hidden text-gray-600 focus:outline-none"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Abrir menú</span>
          <div className="space-y-1">
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </div>
        </button>

        {/* Menú */}
        <nav
          className={`flex-col sm:flex-row sm:flex items-center
            ${open ? "flex" : "hidden sm:flex"} space-y-2 sm:space-y-0 sm:space-x-4`}
        >
          {!token ? (
            <>
              <Link to="/login" className="btn-purple">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn-green">
                Regístrate
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/ranking" className="hover:underline">
                Ranking
              </Link>
              <Link to="/profile" className="hover:underline">
                Mi Perfil
              </Link>
              <button onClick={handleLogout} className="btn-red">
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
