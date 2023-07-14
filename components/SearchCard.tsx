import { Card, CardContent } from "@/components/ui/card";
import { AnimeResult } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

const SearchCard = ({ result, key }: { result: AnimeResult; key: string }) => {
  return (
    <Card className="group rounded-none border-b hover:bg-accent" key={key}>
      <CardContent className="p-0">
        <Link
          href={`/watch/${result.title}${result.id}`}
          className="flex justify-between px-4 py-2 w-full"
          key={result.id}
        >
          <div>
            <Image
              src={result.image}
              alt={result.image}
              width={50}
              height={50}
              className="object-cover rounded-sm"
            />
          </div>
          <div className="pl-4 flex flex-col flex-1 items-left justify-center overflow-hidden">
            <h3 className="truncate">{result.title.userPreferred}</h3>
            <div className="pt-2 text-muted-foreground group-hover:text-foreground text-xs">
              <span>{result.releaseDate}</span>
              <i className="inline-block my-1 w-1 h-1 bg-foreground rounded-full mx-1"></i>
              {result.type}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SearchCard;
