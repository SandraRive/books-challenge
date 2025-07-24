// src/pages/RegisterPage.tsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerRequest } from "../services/auth";
import Header from "../components/Header";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await registerRequest({ name, email, password });
      login(token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-center bg-gray-100 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Regístrate</h2>
          {error && <p className="mb-2 text-red-600">{error}</p>}
          <label className="block mb-2">
            <span className="text-gray-700">Nombre</span>
            <input
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="tú@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Contraseña</span>
            <input
              type="password"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Crear cuenta
          </button>
          <p className="mt-4 text-center text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
