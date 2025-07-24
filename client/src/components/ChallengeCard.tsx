// src/components/ChallengeCard.tsx
import React, { useState } from "react";
import { Challenge } from "../types";                  // ➜ Importa el tipo desde tu fichero de tipos
import { updateChallenge } from "../services/challenges";

interface Props {
  challenge: Challenge;
  onToggled: () => void; // Callback para que el padre recargue o actualice su estado
}

export default function ChallengeCard({ challenge, onToggled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      // Llama a la API para marcar/desmarcar
      await updateChallenge(challenge._id, !challenge.completed);
      // Avisamos al padre para que recargue la lista o actualice localmente
      onToggled();
    } catch (err) {
      console.error("Error toggling:", err);
      alert("No se pudo cambiar el estado del reto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-4 rounded shadow ${
        challenge.completed ? "bg-green-50" : "bg-white"
      }`}
    >
      <h4 className="font-semibold text-lg mb-1">{challenge.title}</h4>
      <p className="text-gray-700 mb-2">{challenge.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Tipo: <span className="capitalize">{challenge.type}</span>
      </p>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={[
          "px-4 py-2 rounded text-white transition-colors",
          challenge.completed
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-green-500 hover:bg-green-600",
          loading && "opacity-50 cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {challenge.completed ? "Desmarcar" : "Marcar completado"}
      </button>
    </div>
  );
}
