import Link from "next/link";
import CommandMenu from "./CommandMenu";
import MobileNav from "./MobileNav";
import { siteConfig } from "@/lib/constants";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Github, Search, User2 } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MobileNav />
        <div className="ml-2 mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">rainime</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center sm:space-x-2 justify-end">
          <div className="flex sm:hidden">
            <Dialog>
              <DialogTrigger
                className={cn(
                  buttonVariants({
                    variant: "anime",
                  }),
                  "text-center cursor-pointer w-9"
                )}
              >
                <Search className="h-4 w-4 shrink-0 " />
              </DialogTrigger>
              <DialogContent className="top-[100px] sm:hidden">
                <CommandMenu />
              </DialogContent>
            </Dialog>
          </div>
          <div className="hidden sm:flex sm:max-w-[400px] w-full ">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Github className="h-4 w-4" />
              </div>
            </Link>
            <ModeToggle />
            <Link href="/signin">
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <User2 className="h-4 w-4" />
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
