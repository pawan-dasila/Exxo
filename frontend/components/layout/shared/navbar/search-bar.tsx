"use client";

import { useState, useRef } from "react";
import { Search, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { SuggestionsPanel } from "./search-suggestions";

export function DesktopSearchBar() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Koramangala, Bangalore");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = (path: string) => {
    setDropdownOpen(false);
    setQuery("");
    router.push(path);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className="hidden md:flex flex-1 max-w-2xl relative"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center bg-[#f4f5f8] border border-transparent focus-within:border-stone-200 focus-within:bg-white focus-within:shadow-md rounded-full px-4 py-2 transition-all duration-200 gap-2"
      >
        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          {debouncedQuery.length >= 2 && dropdownOpen ? (
            <Loader2 className="w-4 h-4 text-violet-500 shrink-0 animate-spin" />
          ) : (
            <Search className="text-stone-400 shrink-0 w-4 h-4" />
          )}
          <input
            type="text"
            placeholder="Search for items (e.g. Camera, Laptop, Tent...)"
            value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                e.preventDefault();
                navigate(`/products?q=${encodeURIComponent(query.trim())}`);
              }
            }}
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-[13px] text-stone-800 placeholder:text-stone-400/80 w-full min-w-0"
          />
        </div>

        <div className="w-px h-5 bg-stone-300 shrink-0" />

        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <MapPin className="text-stone-500 shrink-0 w-4 h-4" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-xs font-semibold text-stone-700 placeholder:text-stone-400/80 w-32 truncate"
          />
          <span className="bg-stone-200/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-stone-600 shrink-0 select-none">
            5 km
          </span>
          <ChevronDown className="text-stone-400 w-3.5 h-3.5 shrink-0 ml-0.5" />
        </div>
      </form>

      {dropdownOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <SuggestionsPanel
            query={query}
            debouncedQuery={debouncedQuery}
            onNavigate={navigate}
          />
        </div>
      )}
    </div>
  );
}

export function MobileSearchDialog() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Koramangala, Bangalore");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  const navigate = (path: string) => {
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="md:hidden flex items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open search"
            className="rounded-full hover:bg-stone-100 transition-all w-10 h-10"
          >
            <Search className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </Button>
        </DialogTrigger>

        <DialogContent
          className="p-0 top-[8%] translate-y-0 overflow-hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-lg mx-auto w-[calc(100%-2rem)] gap-0"
          showCloseButton={false}
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">Search</DialogTitle>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100"
          >
            {debouncedQuery.length >= 2 ? (
              <Loader2 className="w-4 h-4 text-violet-500 shrink-0 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <Input
              type="text"
              placeholder="Search products, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  e.preventDefault();
                  navigate(`/products?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="border-none shadow-none focus-visible:ring-0 h-8 px-0 text-sm w-full bg-transparent"
              autoFocus
            />

            <button
              type="submit"
              aria-hidden="true"
              className="sr-only"
              tabIndex={-1}
            />
          </form>

          <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-xs text-zinc-600 outline-none flex-1 font-medium"
            />
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded-full">
              5 km
            </span>
          </div>

          <SuggestionsPanel
            query={query}
            debouncedQuery={debouncedQuery}
            onNavigate={navigate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
