// src/pages/RegisterPage.tsx
import React, { useState, useContext, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { registerRequest } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { authenticate } = useContext(AuthContext);

  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Llamada al servicio que devuelve el token
      const token = await registerRequest({ name, email, password });
      // Guardamos el token en contexto y localStorage
      authenticate(token);
      // Redirigimos al dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Error en el registro");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded shadow"
        >
          <h2 className="text-2xl font-bold mb-6">Regístrate</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Crear cuenta
          </button>

          <p className="mt-4 text-center">
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
