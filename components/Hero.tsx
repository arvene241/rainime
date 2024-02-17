import { AnimeTrending } from "@/lib/types";
import Carousel from "./Carousel";

const getData = async ({ url }: { url: string }) => {
  const res = await fetch(url);
  const data = await res.json();

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data.results;
};

const Hero = async () => {
  const url = `https://consumet-mocha.vercel.app/meta/anilist/trending`;

  const results: AnimeTrending[] = await getData({ url });

  return <Carousel results={results} />;
};

export default Hero;
