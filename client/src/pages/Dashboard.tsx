// src/pages/Dashboard.tsx
import Header from "../components/Header";
export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Tu Dashboard de Retos</h2>
        {/* Aquí iremos creando las cartas de retos */}
      </main>
    </div>
  );
}
