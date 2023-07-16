"use client";

import { AnimeTrending } from "@/lib/types";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Carousel, Flowbite } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const customTheme: CustomFlowbiteTheme = {
  carousel: {},
};

const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [animeTrending, setAnimeTrending] = useState<AnimeTrending[]>([]);

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

  console.log(animeTrending);

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Carousel>
        {animeTrending.map((anime) => (
          <div key={anime.id}>
            <Image
              src={anime.image}
              alt={anime.title.userPreferred}
              width={500}
              height={500}
              className="w-full object-cover"
            />
            <div className="h-[50px] md:hidden bg-card">
              {anime.title.userPreferred}
            </div>
            <div className="hidden md:h-[100px]">
              <div>
                <h1>{anime.title.userPreferred}</h1>
                <p>{anime.rating}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </Flowbite>
  );
};

export default Hero;
