import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroSearch from "./HeroSearch";

const Hero = () => {
  return (
    <section className="relative w-full bg-background text-foreground overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-[20px] px-6 pb-12 lg:px-[50px] mx-auto pt-6 md:pt-0">
        <div className="w-full lg:w-[500px] shrink-0 text-left">
          <div className="inline-flex items-center gap-[6px] px-[12px] py-[5px] rounded-[20px] bg-secondary text-secondary-foreground text-[11px] md:text-[12px] font-semibold mb-[18px]">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            #1 Peer-to-Peer Rental Platform in Bangalore
          </div>

          <h1 className="text-[36px] md:text-[42px] lg:text-[48px] font-extrabold leading-[1.1] text-foreground mb-[16px] tracking-tight">
            Why buy, when you
            <br />
            can rent <span className="text-primary font-heading">anything</span>
            <br />
            nearby?
          </h1>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.6] mb-[28px] max-w-[440px]">
            From cameras to clothes - access what you need,
            <br className="hidden md:block" />
            when you need it.
          </p>

          <HeroSearch />

          <div className="flex flex-row gap-3 mb-[32px] w-full">
            <Button
              size="lg"
              className="flex-1 md:flex-none md:w-auto rounded-lg text-[13px] md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md px-4 md:px-10"
            >
              Rent Now →
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 md:flex-none md:w-auto rounded-lgtext-[13px] md:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm border-[1.5px] px-4 md:px-10"
            >
              List Your Item ↗
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-[12px]">
            <div className="flex">
              <div className="w-7 h-7 rounded-full border-2 border-background bg-rose-400 flex items-center justify-center text-[10px] font-bold text-white -mr-2 shadow-sm">
                A
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-background bg-blue-400 flex items-center justify-center text-[10px] font-bold text-white -mr-2 shadow-sm">
                R
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-background bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-white -mr-2 shadow-sm">
                S
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-background bg-orange-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                M
              </div>
            </div>
            <div className="ml-2 md:ml-4">
              <p className="text-[13px] font-bold text-foreground mb-0">
                Trusted by 10,000+ users in Bangalore
              </p>
              <p className="text-[11px] text-muted-foreground">
                <span className="text-emerald-500">★★★★★</span> &nbsp;4.8/5 from
                2,500+ reviews
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full h-[300px] md:h-[400px] lg:h-[600px] max-w-full lg:max-w-[1200px] mt-8 lg:mt-0">
          <Image
            src="/assets/hero-im.png"
            alt="Rent Anything Nearby"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            className="object-contain lg:object-right"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
