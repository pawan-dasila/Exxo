"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="space-y-8">
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 blur-xl opacity-50" />
            <div className="relative w-24 h-24 bg-white rounded-3xl shadow-sm border border-red-50 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-[#090A0A] tracking-tight">
              Access Denied
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed max-w-[280px] mx-auto font-medium">
              You don&apos;t have the required administrative permissions to
              view this page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50 transition-all font-semibold"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
            <Button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#090A0A] text-white hover:bg-[#1A1A1A] transition-all font-semibold shadow-lg shadow-black/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Secondary Help Text */}
          <p className="text-stone-400 text-sm font-medium pt-8">
            If you believe this is an error, please contact your systems
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
