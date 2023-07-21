import { RxResume } from "react-icons/rx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Config } from "@/lib/constants";
import React from "react";
import Link from "next/link";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <RxResume className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-2/3">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-2">
            {Config.sidebarNav.map((item, index) => (
              <div key={index}>
                {item.href ? (
                  <SheetClose asChild>
                    <Link href={item.href} className="font-medium capitalize">
                      {item.title}
                    </Link>
                  </SheetClose>
                ) : (
                  <div className="font-medium capitalize">{item.title}</div>
                )}
                <ul className="grid-cols-2 grid ">
                  {item.items.map((item) => (
                    <li key={item.href} className="">
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="text-muted-foreground capitalize"
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
