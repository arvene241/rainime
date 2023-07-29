"use client";

import { useEffect, useState, useRef } from "react";
import { AnimeResult } from "@/lib/types";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import SearchCard from "./SearchCard";
import { usePathname, useRouter } from 'next/navigation'
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const CommandMenu = () => {
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [animeResult, setAnimeResult] = useState<AnimeResult[]>();
  const [open, setOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const router = useRouter()
  
  useEffect(() => {
    setOpen(false);
    setSearchItem("");
  }, [pathName]);

  useEffect(() => {
    let handler = (event: MouseEvent) => {
      if (!resultRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

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
      setOpen(true);
      fetchedData();
    }
  }, [searchItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?keyword=${searchItem}`);
  };

  const filteredResults = animeResult?.slice(0, 5);

  return (
    <div className="relative w-full" ref={resultRef}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center h-9 px-4 py-2 relative"
      >
        <Input
          type="text"
          placeholder="Search anime name"
          onChange={handleChange}
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
      {open && (
        <div className="absolute md:mt-2 mt-6 px-4 w-full">
          <ul className="rounded-lg border h-auto overflow-y-auto overflow-x-hidden">
            {loading ? (
              <div className="bg-background text-foreground text-center font-bold">
                Loading...
              </div>
            ) : (
              <>
                {animeResult?.length === 0 && (
                  <li className="py-6 text-center text-sm bg-background text-foreground font-bold">
                    No results found.
                  </li>
                )}
                {filteredResults?.map((result) => (
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
