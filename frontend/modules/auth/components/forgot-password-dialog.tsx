"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "../hooks/use-forgot-password";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
}

export const ForgotPasswordDialog = ({
  open,
  onOpenChange,
  initialEmail = "",
}: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setEmail(initialEmail);
      setIsSuccess(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isPending) return;

    forgotPassword(email, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] bg-white dark:bg-slate-950 border-none rounded-none p-0 overflow-hidden shadow-2xl [&>button]:hidden outline-none">
        <div className="p-8 sm:p-12 flex flex-col items-center">
          {/* Main Icon Section */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
              {isSuccess ? (
                <Mail className="h-8 w-8 text-green-500 stroke-[1.5px]" />
              ) : (
                <KeyRound className="h-8 w-8 text-primary stroke-[1.5px]" />
              )}
            </div>
          </div>

          <DialogHeader className="text-center space-y-4 mb-8 w-full">
            <DialogTitle className="text-3xl sm:text-4xl italic font-serif font-light tracking-tight text-slate-900 dark:text-slate-50">
              {isSuccess ? "Check Your Email" : "Reset Password"}
            </DialogTitle>
            <DialogDescription className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              {isSuccess
                ? "Please check your email for further instructions to securely reset your password."
                : "Enter your email address and we'll send you a link to reset your password."}
            </DialogDescription>
          </DialogHeader>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-1">
                <Label
                  htmlFor="reset-email"
                  className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                >
                  Email Address
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-t-0 border-x-0 border-b border-slate-300 dark:border-slate-700 focus-visible:ring-0 focus-visible:border-primary bg-transparent px-0 py-6 text-base transition-colors"
                  required
                  disabled={isPending}
                />
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <Button
                  type="submit"
                  disabled={isPending || !email}
                  className="w-full h-14 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 rounded-none font-bold text-xs tracking-widest uppercase hover:bg-primary transition-all duration-300 border border-transparent flex items-center justify-center gap-3 group"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors bg-transparent hover:bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="w-full flex flex-col gap-6 mt-4">
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full h-14 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 rounded-none font-bold text-xs tracking-widest uppercase hover:bg-primary transition-all duration-300 border border-transparent"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
