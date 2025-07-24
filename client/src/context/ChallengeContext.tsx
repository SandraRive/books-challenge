// client/src/context/ChallengeContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchChallenges,
  createChallenge as apiCreate,
  updateChallenge as apiUpdate,
  NewChallenge,
} from "../services/challenges";

import { Challenge } from "../types";

interface ChallengeContextData {
  challenges: Challenge[];
  reload: () => Promise<void>;
  createChallenge: (data: NewChallenge) => Promise<void>;
  toggleChallenge: (id: string, completed: boolean) => Promise<void>;
}

const ChallengeContext = createContext<ChallengeContextData | undefined>(
  undefined
);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Carga inicial y recarga
  const reload = async () => {
    const data = await fetchChallenges();
    setChallenges(data);
  };

  useEffect(() => {
    reload();
  }, []);

  // Crea un reto
  const createChallenge = async (data: NewChallenge) => {
    const created = await apiCreate(data);
    setChallenges((prev) => [...prev, created]);
  };

  // Marca/desmarca reto
  const toggleChallenge = async (id: string, completed: boolean) => {
    const updated = await apiUpdate(id, completed);
    setChallenges((prev) =>
      prev.map((c) => (c._id === id ? updated : c))
    );
  };

  return (
    <ChallengeContext.Provider
      value={{ challenges, reload, createChallenge, toggleChallenge }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

// Hook auxiliar
export function useChallenges() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) {
    throw new Error(
      "useChallenges debe usarse dentro de <ChallengeProvider>"
    );
  }
  return ctx;
}
