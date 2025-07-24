// src/types.ts
export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: "libro" | "manga" | "pelicula" | "serie";
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewChallenge {
  title: string;
  description: string;
  type: "libro" | "manga" | "pelicula" | "serie";
}
