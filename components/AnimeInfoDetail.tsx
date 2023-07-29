"use client";

import { AnimeInfo, Datee } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { animeStore } from "@/lib/context";
import { cleanDescription } from "@/lib/utils";

const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month] || "";
};

const formatDate = (date: Datee): string => {
  const { year, month, day } = date;
  const monthName = getMonthName(month);
  return `${monthName} ${day}, ${year}`;
};

const AnimeInfoDetail = ({ data }: { data: AnimeInfo }) => {
  const setCurrentAnime = animeStore((state) => state.setCurrentAnime);

  const lastIndexEp = data.episodes.length - 1;

  setCurrentAnime(data);

  const cleanedDescription = cleanDescription(data.description);

  return (
    <div className="flex flex-col mdl:flex-row py-8 px-4 justify-center gap-4 mdl:gap-8">
      {/* Image */}
      <div className="w-[130px] mdl:w-[250px] bg-foreground p-1 rounded-lg self-center">
        <Image
          src={data.image}
          alt={data.title.romaji}
          width={300}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>
      {/* Content */}
      <div className="flex flex-col mdl:flex-row gap-4 mdl:w-[80%] mdl:items-center mdl:gap-8">
        <div className="flex flex-col mdl:w-3/4 gap-4">
          {/* Titles */}
          <div className="self-center text-center mdl:self-start mdl:text-left">
            <h2 className="font-bold text-lg text-foreground mdl:text-3xl pb-2">
              {data.title.romaji}
            </h2>
            <p className="w-[300px] text-sm text-muted-foreground mdl:text-md mdl:w-auto">
              {data.title.romaji}, {data.title.native}, {data.title.english}
            </p>
          </div>
          <Button asChild className="self-center w-[150px] mdl:self-start">
            <Link href={`/watch/${data.episodes[lastIndexEp].id}`}>
              Watch Now
            </Link>
          </Button>
          {/* Description */}
          <p className="text-xs mdl:text-sm line-clamp-6">{cleanedDescription}</p>
          {/* Genres */}
          <div className="flex gap-3">
            {data.genres.map((genre) => (
              <div
                className="border-transparent bg-muted text-xs text-white py-1 px-2 rounded mdl:text-sm cursor-pointer"
                key={genre}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
        {/* Other Details */}
        <div className="text-xs flex flex-col gap-1 mdl:w-1/4 mdl:text-sm">
          <div>
            Type:{" "}
            <span
              className="font-bold text-[#3a82ff] cursor-pointer"
            >
              {data.type}
            </span>
          </div>
          <div>
            Studio:{" "}
            {data.studios.map((studio, index) => (
              <span
                key={studio}
                className="font-bold text-[#3a82ff] cursor-pointer"
              >
                {studio}
                {index !== data.studios.length - 1 && ", "}
              </span>
            ))}
          </div>
          <div>
            Date Aired: {formatDate(data.startDate)} to{" "}
            {data.endDate.year && formatDate(data.endDate)}
          </div>
          <div>Status: {data.status}</div>
          <div>
            Rating: {data.rating ? `${(data.rating / 20).toFixed(1)} /5` : "N/A"}
          </div>
          <div>
            Premiered: {data.season} {data.releaseDate}
          </div>
          <div>Duration: {data.duration ? `${data.duration} minutes` : "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default AnimeInfoDetail;