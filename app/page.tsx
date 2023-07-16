import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container flex flex-col md:flex-row gap-12">
      <div className="w-full h-[350px]">
        <Hero />
      </div>
      <div className="w-[330px]">
        <h1>Hello world</h1>
      </div>
    </main>
  );
}
