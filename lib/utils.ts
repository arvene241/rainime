import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Datee } from "@/lib/types";

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

export const getMonthName = (month: number): string => {
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

export const formatDate = (date: Datee): string => {
  const { year, month, day } = date;
  const monthName = getMonthName(month);
  return `${monthName} ${day}, ${year}`;
};