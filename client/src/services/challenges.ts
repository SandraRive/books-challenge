// client/src/services/challenges.ts
import api from "./api";
import { Challenge } from "../types";

/** Datos para crear un nuevo reto */
export interface NewChallenge {
  title: string;
  description: string;
  type: "libro" | "manga" | "pelicula" | "serie";
}

/** Obtiene todos los retos del usuario */
export async function fetchChallenges(): Promise<Challenge[]> {
  const resp = await api.get<Challenge[]>("/challenges");
  return resp.data;
}

/** Crea un nuevo reto */
export async function createChallenge(data: NewChallenge): Promise<Challenge> {
  const resp = await api.post<Challenge>("/challenges", data);
  return resp.data;
}
