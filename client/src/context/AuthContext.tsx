// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextData {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;  // hace fetch /login
  authenticate: (token: string) => void;                      // guarda token
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  token: null,
  login: async () => {},
  authenticate: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  // login(email,password) → hace la petición y llama a authenticate
  const login = async (email: string, password: string) => {
    const resp = await fetch("/login", /* o api.post */);
    const { token } = await resp.json();
    authenticate(token);
  };

  // authenticate(token) → guarda en localStorage y en estado
  const authenticate = (tok: string) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, login, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
