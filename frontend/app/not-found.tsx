import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
      <div className="space-y-6 max-w-lg">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700">
          Error 404
        </p>

        <h1 className="text-5xl md:text-7xl font-serif italic font-light tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
          Lost in the <br />
          <span className="not-italic font-sans font-bold tracking-tighter">
            COLLECTION.
          </span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
          The piece you&apos;re looking for has drifted off the standard release
          cycle. It may have been archived or moved to a new drop.
        </p>

        <div className="pt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/90 transition-all rounded-full group"
          >
            Shop Latest Arrivals
            <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="pt-12">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-tighter text-muted-foreground hover:text-black transition-colors underline underline-offset-4"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
