// src/components/Header.tsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full py-4 px-8 flex justify-between items-center bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">BooksChallenge</h1>
      <nav className="space-x-4">
       <Link to="/login" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
         Iniciar sesión
       </Link>
       <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
         Regístrate
       </Link>
      </nav>
    </header>
  );
}

