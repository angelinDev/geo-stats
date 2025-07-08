import Image from "next/image";
import WorldMapChart from "./components/utils/WorldMapChart";

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Carte Interactive du Monde
        </h1>
        <main className="w-full">
          <WorldMapChart />
        </main>
      </div>
    </div>
  );
}
