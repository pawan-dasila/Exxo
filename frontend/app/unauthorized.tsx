"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Icon & Brand Header */}
        <div className="space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-stone-100 rounded-full scale-150 blur-2xl opacity-60" />
            <div className="relative w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-black">
            Vestrostyles Identity Check
          </h2>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif italic font-light tracking-tight text-[#090A0A]">
            Access Restricted.
          </h1>
          <p className="text-stone-500 text-base leading-relaxed max-w-[300px] mx-auto font-medium">
            This collection is reserved for registered members and administrators. Please identify yourself to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            asChild
            className="h-14 px-10 rounded-full bg-black text-white hover:bg-stone-900 transition-all font-bold uppercase tracking-widest shadow-xl shadow-black/10 group"
          >
            <Link href="/sign-in">
              <LogIn className="w-4 h-4 mr-3 transition-transform group-hover:translate-x-1" />
              Sign In to Boutique
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-12 text-stone-400 hover:text-black hover:bg-transparent transition-colors font-semibold uppercase tracking-tighter text-[10px]"
          >
            <ArrowLeft className="w-3 h-3 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Bottom Detail */}
        <div className="pt-8 border-t border-stone-100">
          <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">
            Exclusive Digital Retail Experience &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
