// src/context/ChallengeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchChallenges } from "../services/challenges";
import { Challenge } from "../types";

interface ChallengeContextData {
  challenges: Challenge[];
  reload: () => Promise<void>;
}

export const ChallengeContext = createContext<ChallengeContextData>({
  challenges: [],
  reload: async () => {},
});

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const load = async () => {
    const data = await fetchChallenges();
    setChallenges(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ChallengeContext.Provider value={{ challenges, reload: load }}>
      {children}
    </ChallengeContext.Provider>
  );
}
