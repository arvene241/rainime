import Hero from "@/components/Hero";
import PopularAnime from "@/components/PopularAnime";
import RecentlyUpdated from "@/components/RecentlyUpdated";

export default function Home() {
  return (
    <main className="container flex flex-col gap-12">
      <Hero />
      <div className="w-full flex flex-col lg:flex-row gap-12">
        <RecentlyUpdated />
        <PopularAnime />
      </div>
      {/* Airing Schedule */}
    </main>
  );
}
