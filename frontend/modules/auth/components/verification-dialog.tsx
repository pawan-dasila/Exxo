"use client";

import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useResendVerification } from "../hooks/use-resend-verification";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export const VerificationDialog = ({
  open,
  onOpenChange,
  email,
}: VerificationDialogProps) => {
  const router = useRouter();
  const { mutate: resend, isPending } = useResendVerification();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0) return;
    resend(email, {
      onSuccess: () => {
        setCountdown(60);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[450px] bg-white dark:bg-slate-950 border-none rounded-none p-0 overflow-hidden shadow-2xl [&>button]:hidden outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-8 sm:p-12 flex flex-col items-center">
          {/* Main Icon Section */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
              <Mail className="h-8 w-8 text-primary stroke-[1.5px]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </div>

          {/* Header Section */}
          <DialogHeader className="text-center space-y-4 mb-8">
            <DialogTitle className="text-3xl sm:text-4xl italic font-serif font-light tracking-tight text-slate-900 dark:text-slate-50">
              Awaiting Verification
            </DialogTitle>
            <DialogDescription className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              We have dispatched a verification link to
              <span className="block mt-2 text-slate-900 dark:text-slate-100 normal-case tracking-normal text-sm font-medium underline underline-offset-4 decoration-primary/20">
                {email}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Instruction Steps */}
          <div className="w-full space-y-4 mb-10 py-6 border-y border-slate-100 dark:border-slate-900/50">
            {[
              "Check your digital correspondence",
              "Execute the verification link provided",
              "Return here to enter the sanctuary",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <span className="text-[10px] font-serif italic text-primary/60 font-medium w-4 text-right">
                  {i + 1}.
                </span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <DialogFooter className="w-full flex flex-col gap-6 sm:flex-col items-center">
            {/* Primary Action */}
            <Button
              onClick={() => {
                onOpenChange(false);
                router.push("/login");
              }}
              className="w-full h-14 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 rounded-none font-bold text-xs tracking-widest uppercase hover:bg-primary transition-all duration-300 border border-transparent shadow-lg flex items-center justify-center gap-3 group"
            >
              Sign In to Sanctuary
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <div className="flex flex-col items-center gap-4">
              <Separator className="w-6" />
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isPending || countdown > 0}
                className="h-auto p-0 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group bg-transparent hover:bg-transparent"
              >
                <RotateCcw
                  className={`h-3 w-3 ${isPending ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-700`}
                />
                {countdown > 0
                  ? `Resend link in ${countdown}s`
                  : "Request New Correspondence"}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
