// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-purple-600 to-indigo-600 text-white px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-center">
          ¡Bienvenido a BooksChallenge!
        </h2>
        <p className="mb-8 text-lg md:text-2xl text-center max-w-xl">
          Completa retos de lectura, cine y series. Comparte tus logros y
          escala posiciones en el ranking.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow hover:bg-gray-100"
        >
          Empieza ahora
        </Link>
      </main>
      <footer className="py-4 text-center text-white bg-gray-800">
        © 2025 BooksChallenge
      </footer>
    </div>
  );
}
