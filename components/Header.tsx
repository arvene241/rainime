import Link from "next/link";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import SearchBox from "./SearchBox";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-bg">
      <div className="container relative flex h-16 items-center gap-3 md:gap-6">
        <MobileNav />
        <Link
          href="/"
          className="flex items-center gap-2 rounded-control py-2 pr-1"
          aria-label="rainime home"
        >
          <Logo />
        </Link>
        <NavLinks className="hidden md:flex" />
        <div className="flex flex-1 items-center justify-end">
          <SearchBox />
        </div>
      </div>
    </header>
  );
};

export default Header;
