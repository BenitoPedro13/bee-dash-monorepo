import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[10px] border border-slate-200 !bg-white py-2.5 text-sm ring-offset-white focus-visible:outline-[#0E121B] disabled:cursor-not-allowed disabled:opacity-50 !text-[#0E121B]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Search = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full  items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <SearchIcon className="h-[16px] w-[16px] absolute pointer-events-none" />
        <input
          {...props}
          type="search"
          ref={ref}
          placeholder="Procure por creators..."
          className="w-full text-sm leading-5 font-nexa p-2 pl-6 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-[#64748B]"
        />
      </div>
    );
  }
);

Search.displayName = "Search";

export { Search };
