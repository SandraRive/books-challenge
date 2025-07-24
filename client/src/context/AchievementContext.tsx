import React, { createContext, useState, useEffect, ReactNode } from "react";
import { fetchAchievements, Achievement } from "../services/achievements";

interface AchievementContextData {
  achievements: Achievement[];
  reload: () => Promise<void>;
}

export const AchievementContext = createContext<AchievementContextData>({
  achievements: [],
  reload: async () => {},
});

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const load = async () => {
    const data = await fetchAchievements();
    setAchievements(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AchievementContext.Provider value={{ achievements, reload: load }}>
      {children}
    </AchievementContext.Provider>
  );
}
