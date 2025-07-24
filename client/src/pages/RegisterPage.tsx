import React, { useState, useContext, FormEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerRequest } from "../services/auth";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await registerRequest({ name, email, password });
      // Tras registrarse, reutilizamos login para guardar token y redirigir
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Regístrate</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nombre</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
