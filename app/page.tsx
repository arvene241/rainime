import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container flex flex-col lg:flex-row gap-12">
      <Hero />
      <div className="w-full flex-1">
        <h1>Hello world</h1>
      </div>
    </main>
  );
}
