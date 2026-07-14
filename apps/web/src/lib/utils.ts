import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getParam<T extends string | string[]>(param: T): string {
  return Array.isArray(param) ? param[0] : param;
}
