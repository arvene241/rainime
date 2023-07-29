import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanDescription = (description: string) => {
  if (!description) return "No description available for this show at this current time";

  // Remove HTML tags.
  description = description.replace(/<[^>]*>/g, "");

  // Remove italics.
  description = description.replace(/_([^_]+)_/g, "$1");

  // Remove bold.
  description = description.replace(/\*\*([^\*]+)\*\*/g, "$1");

  // Remove newlines.
  description = description.replace("\n", " ");

  // Return the cleaned description.
  return description;
}