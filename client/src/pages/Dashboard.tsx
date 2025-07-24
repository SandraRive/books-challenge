// src/pages/Dashboard.tsx
import React, { useContext, useState, FormEvent } from "react";
import Header from "../components/Header";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeContext } from "../context/ChallengeContext";
import { createChallenge, NewChallenge } from "../services/challenges";
import { Challenge } from "../types";

export default function Dashboard() {
  const { challenges, reload } = useContext(ChallengeContext);

  const [form, setForm] = useState<NewChallenge>({
    title: "",
    description: "",
    type: "libro",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createChallenge(form);
      setForm({ title: "", description: "", type: "libro" });
      await reload();
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Error creando reto");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Tu Dashboard de Retos</h2>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 p-6 bg-white rounded shadow"
        >
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.title}
              onChange={(e) =>
                setForm((f: NewChallenge) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.description}
              onChange={(e) =>
                setForm((f: NewChallenge) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              className="mt-1 block w-full border rounded px-3 py-2"
              value={form.type}
              onChange={(e) =>
                setForm((f: NewChallenge) => ({
                  ...f,
                  type: e.target.value as NewChallenge["type"],
                }))
              }
            >
              <option value="libro">Libro</option>
              <option value="manga">Manga</option>
              <option value="pelicula">Película</option>
              <option value="serie">Serie</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={challenges.length >= 2}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {challenges.length >= 2 ? "Límite alcanzado" : "Crear reto"}
          </button>
        </form>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c: Challenge) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
