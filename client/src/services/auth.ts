// src/services/auth.ts
import api from "./api";

interface LoginData { email: string; password: string; }
export async function loginRequest(data: LoginData): Promise<string> {
  const resp = await api.post("/login", data);
  return resp.data.token as string;
}

interface RegisterData { name: string; email: string; password: string; }
export async function registerRequest(data: RegisterData): Promise<string> {
  const resp = await api.post("/register", data);
  return resp.data.token as string;
}
