"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="btn btn-ghost btn-icon -ml-2 md:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[82%] max-w-xs">
        <SheetTitle className="mb-6">
          <Logo />
        </SheetTitle>
        <NavLinks vertical onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
