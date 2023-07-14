"use client";

import { useEffect, useState } from "react";
import { AnimeResult } from "@/lib/types";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import SearchCard from "./SearchCard";
import router from "next/router";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const CommandMenu = () => {
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [animeResult, setAnimeResult] = useState<AnimeResult[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const fetchedData = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.consumet.org/meta/anilist/${searchItem}`
        );
        const data = await res.json();

        setAnimeResult(data.results);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    if (searchItem.length >= 2) {
      fetchedData();
    }
  }, [searchItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search/${searchItem}`);
  };

  const filteredResults = animeResult.slice(0, 5);

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center h-9 px-4 py-2 relative"
      >
        <Input
          type="text"
          placeholder="Search forn an anime"
          onChange={handleChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(true)}
          value={searchItem}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-9 outline-none ring-0 focus-visible:ring-0"
          )}
        />
        <Button
          type="submit"
          size="icon"
          variant="anime"
          className="opacity-50 absolute right-0 mr-4 text-center cursor-pointer h-9"
        >
          <Search className="h-4 w-4 shrink-0 " />
        </Button>
      </form>
      {isInputFocused && searchItem.length >= 2 && (
        <div className="absolute mt-2 px-4 w-full">
          <ul className="rounded-lg border max-h-[300px] overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {animeResult?.length === 0 && (
                  <li className="py-6 text-center text-sm">
                    No results found.
                  </li>
                )}
                {filteredResults.map((result) => (
                  <SearchCard result={result} key={result.id} />
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommandMenu;
