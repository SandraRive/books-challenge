// src/components/ChallengeCard.tsx
import React from "react";
import { Challenge } from "../types";

interface Props {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: Props) {
  return (
    <div
      className={`border rounded p-4 shadow-sm ${
        challenge.completed ? "bg-green-100" : "bg-white"
      }`}
    >
      <h3 className="text-xl font-semibold">{challenge.title}</h3>
      <p className="text-gray-700">{challenge.description}</p>
      <p className="mt-2 text-sm text-gray-500">Tipo: {challenge.type}</p>
    </div>
  );
}
