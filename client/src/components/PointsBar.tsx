// client/src/components/PointsBar.tsx
import React from "react";

interface Props {
  completed: number;
  total: number;
}

export default function PointsBar({ completed, total }: Props) {
  // Evitar división por cero
  const pct = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
      <div
        className="h-full bg-blue-600"
        style={{ width: `${pct}%`, transition: "width 0.3s ease" }}
      />
    </div>
  );
}
