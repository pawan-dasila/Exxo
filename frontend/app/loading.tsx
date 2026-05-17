import { siteConfig } from "@/lib/config/site";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
      <div className="fixed top-0 left-0 right-0 h-[3px] overflow-hidden bg-stone-50">
        <div className="h-full w-full bg-[#090A0A] animate-loading-bar" />
      </div>

      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-semibold font-serif text-[#090A0A] tracking-[0.2em] uppercase select-none animate-pulse-gentle">
            {siteConfig.name}
          </h1>

          <div className="absolute -bottom-2 left-0 h-px bg-stone-200 w-full animate-width-expand" />
        </div>

        <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-1000 delay-300">
          <span className="text-[9px] font-black uppercase text-stone-300 tracking-[0.3em]">
            Curating your styles
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
