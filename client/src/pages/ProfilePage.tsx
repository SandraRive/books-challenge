// client/src/pages/ProfilePage.tsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api"; // Axios configurado con interceptor

interface MeData {
  name: string;
  email: string;
  totalCreated: number;
  totalCompleted: number;
}

export default function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<MeData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get<MeData>("/me");
        setUser(resp.data);
      } catch (err: any) {
        console.error(err);
        setError("No se pudo cargar tu perfil");
      }
    })();
  }, [token]);

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }
  if (!user) {
    return <p className="p-8">Cargando perfil…</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-8 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mt-4">
          <strong>Retos creados:</strong> {user.totalCreated}
        </p>
        <p>
          <strong>Retos completados:</strong> {user.totalCompleted}
        </p>
      </div>
    </div>
  );
}
