// client/src/components/AchievementsBar.tsx
import React, { useContext } from "react";
import { AchievementContext } from "../context/AchievementContext";

export default function AchievementsBar() {
  const { achievements } = useContext(AchievementContext);
  return (
    <div className="flex space-x-2 overflow-x-auto p-2 bg-white shadow mb-4">
      {achievements.map((a) => (
        <div
          key={a.key}
          className="px-3 py-1 bg-yellow-100 rounded-full text-sm font-medium whitespace-nowrap"
          title={new Date(a.date).toLocaleDateString()}
        >
          {a.title}
        </div>
      ))}
      {achievements.length === 0 && (
        <span className="text-gray-500">Aún no tienes logros</span>
      )}
    </div>
  );
}
