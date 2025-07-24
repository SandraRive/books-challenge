// src/pages/LoginPage.tsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginRequest } from "../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginRequest({ email, password });
      login(token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de autenticación");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <main className="flex-1 flex justify-center items-center bg-gray-100 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
          {error && <p className="mb-2 text-red-600">{error}</p>}
       {/* Email */}
       <label className="block mb-2">
         <span className="text-gray-700">Email</span>
         <input
           type="email"
           className="mt-1 block w-full border rounded px-3 py-2"
           placeholder="tú@ejemplo.com"
           value={email}
           onChange={e => setEmail(e.target.value)}
         />
       </label>
       {/* Password */}
       <label className="block mb-4">
         <span className="text-gray-700">Contraseña</span>
         <input
           type="password"
           className="mt-1 block w-full border rounded px-3 py-2"
           placeholder="••••••••"
           value={password}
           onChange={e => setPassword(e.target.value)}
         />
       </label>
       <button
         type="submit"
         className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
       >
         Entrar
       </button>
     </form>
   </main>
 </div>
);
}

