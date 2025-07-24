// src/pages/Dashboard.tsx
import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import AchievementsBar from "../components/AchievementsBar";
import PointsBar from "../components/PointsBar";
import ChallengeCard from "../components/ChallengeCard";
import { useChallenges } from "../context/ChallengeContext";
import { createChallenge, NewChallenge } from "../services/challenges";
import { Challenge } from "../types";

export default function Dashboard() {
  const {
    challenges,
    reload,
    toggleChallenge,
    createChallenge: createCtx,
  } = useChallenges();

  // Separamos los retos en dos categorías
  const librosYMangas = challenges.filter(
    (c) => c.type === "libro" || c.type === "manga"
  );
  const peliculasYSeries = challenges.filter(
    (c) => c.type === "pelicula" || c.type === "serie"
  );

  // Contamos retos completados (para PointsBar)
  const completedCount = challenges.filter((c) => c.completed).length;

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

        {/* Barra de logros */}
        <AchievementsBar />

        {/* Barra de puntos (ej. completados / total permitido) */}
        <PointsBar completed={completedCount} total={2} />

        {/* Formulario de creación */}
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
                setForm((f) => ({ ...f, title: e.target.value }))
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
                setForm((f) => ({ ...f, description: e.target.value }))
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
                setForm((f) => ({
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

        {/* Sección Libros & Mangas */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Libros &amp; Mangas</h3>
          {librosYMangas.length === 0 ? (
            <p className="text-gray-600">No tienes retos de libros o mangas.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {librosYMangas.map((c: Challenge) => (
                <ChallengeCard
                  key={c._id}
                  challenge={c}
                  onToggled={async () => {
                    await reload();
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección Películas & Series */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Películas &amp; Series</h3>
          {peliculasYSeries.length === 0 ? (
            <p className="text-gray-600">
              No tienes retos de películas o series.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {peliculasYSeries.map((c: Challenge) => (
                <ChallengeCard
                  key={c._id}
                  challenge={c}
                  onToggled={async () => {
                    await reload();
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
