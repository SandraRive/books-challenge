// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/auth";

interface AuthContextData {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  token: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  // Función para autenticar y guardar el token
  const authenticate = (tok: string) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  // Llama al service que hace POST /login y guarda el token
  const login = async (email: string, password: string) => {
    const tok = await loginRequest({ email, password });
    authenticate(tok);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // Si el token cambia (por ej. recarga de página), el interceptor de api
  // ya lo recogerá automáticamente desde localStorage en cada petición.

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
