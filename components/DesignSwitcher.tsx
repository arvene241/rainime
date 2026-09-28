"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_DESIGN, designs } from "@/lib/constants";

const DesignSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? DEFAULT_DESIGN : DEFAULT_DESIGN;
  const currentName = designs.find((d) => d.id === current)?.name ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="btn btn-ghost btn-icon"
        aria-label={`Change design, current: ${currentName}`}
      >
        <Palette className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Design</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current} onValueChange={setTheme}>
          {designs.map((d) => (
            <DropdownMenuRadioItem key={d.id} value={d.id}>
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold">{d.name}</span>
                <span className="text-xs text-muted">{d.blurb}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DesignSwitcher;
