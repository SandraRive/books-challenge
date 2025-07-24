// client/src/pages/Ranking.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { fetchRanking, RankingEntry } from "../services/ranking";

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRanking();
        setRanking(data);
      } catch (err) {
        console.error("Error cargando ranking:", err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">🏆 Ranking de Usuarios</h2>

        {ranking.length === 0 ? (
          <p className="text-gray-600">Aún no hay retos completados.</p>
        ) : (
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Posición</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Retos Completados</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, idx) => (
                <tr
                  key={entry.userId}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{entry.name}</td>
                  <td className="p-3">{entry.completedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
