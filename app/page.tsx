import Hero from "@/components/Hero";
import RecentlyUpdated from "@/components/RecentlyUpdated";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container flex flex-col gap-12">
      <Hero />
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <RecentlyUpdated />
        <div>{/* Top Anime */}</div>
      </div>
      {/* Airing Schedule */}
    </main>
  );
}
