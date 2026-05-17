"use client";

import React from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

const HeroSearch = () => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center bg-background border border-input rounded-2xl md:rounded-xl p-1 gap-1 mb-7 shadow-sm max-w-2xl w-full">
      {/* Item Search */}
      <div className="flex-1 flex items-center gap-3 px-3 py-2 md:py-0">
        <Search className="text-muted-foreground shrink-0" size={18} />
        <Input
          type="text"
          placeholder="Search items (Camera, Drone...)"
          className="h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm p-0 placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="hidden md:block w-px h-6 bg-border mx-1" />
      <div className="block md:hidden h-px w-full bg-border/50 mx-2" />

      {/* Location Search */}
      <div className="flex-[0.6] flex items-center gap-2 px-3 py-2 md:py-0">
        <MapPin className="text-primary shrink-0" size={16} />
        <Input
          type="text"
          defaultValue="Bangalore, KA"
          className="h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm p-0 font-medium"
        />
      </div>

      {/* Search Button */}
      <button className="h-12 md:h-10 md:w-10 bg-primary text-primary-foreground rounded-xl md:rounded-lg flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity shadow-sm mt-1 md:mt-0">
        <span className="md:hidden text-sm font-semibold mr-2">Search Now</span>
        <Search size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default HeroSearch;
