import Link from "next/link";
import CommandMenu from "./CommandMenu";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MobileNav />
        {/* <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              rainime
            </span>
          </Link>
        </div> */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
