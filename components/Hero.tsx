"use client";

import { AnimeTrending } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [animeTrending, setAnimeTrending] = useState<AnimeTrending[]>([]);
  const [curr, setCurr] = useState(0);
  

  useEffect(() => {
    const fetchedData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.consumet.org/meta/anilist/trending`
        );
        const data = await res.json();

        setAnimeTrending(data.results);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchedData();
  }, []);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? animeTrending.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === animeTrending.length - 1 ? 0 : curr + 1));

  return (
    <section className="w-full overflow-hidden relative group h-[290px] md:h-[400px]">
      {animeTrending.map((anime, index) => (
        <div
          key={anime.id}
          className={cn(
            curr === index ? "opacity-1" : "opacity-0",
            "absolute inset-0 w-full h-full"
          )}
        >
          <Link
            href={`/watch/${anime.id}`}
            className="w-full h-full cursor-pointer"
          >
            <Image
              src={anime.cover}
              alt={anime.title.userPreferred}
              width={1000}
              height={1000}
              priority
              className="w-full h-[240px] md:h-[280px] object-cover cursor-pointer"
            />
          </Link>
          <div className="md:hidden p-4 bg-primary text-primary-foreground text-ellipsis overflow-hidden whitespace-nowrap font-bold">
            {anime.title.userPreferred}
          </div>
          <div className="w-full hidden md:flex bg-primary text-primary-foreground px-5 gap-8 items-center justify-center h-5 md:h-[120px]">
            <div className="flex-1">
              <h1 className="text-lg font-bold pb-2">
                {anime.title.userPreferred}
              </h1>
              <p className="text-sm overflow-hidden line-clamp-2">
                {anime.description}
              </p>
            </div>
            <Button
              asChild
              className="font-semibold text-primary bg-primary-foreground"
            >
              <Link href={`/watch/${anime.id}`}>Watch Now</Link>
            </Button>
          </div>
        </div>
      ))}
      <div className="absolute right-0 bottom-[50px] md:bottom-[120px] flex items-center justify-between p-4 gap-4">
        <Button onClick={prev} size="icon" className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={next} size="icon" className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
