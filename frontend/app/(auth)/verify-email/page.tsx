import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { VerifyEmailForm } from "@/modules/auth/components/verify-email-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email — Exxo",
  description: "Verify your email address to access your Exxo account.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function VerifyEmailPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        aria-label="Return to Homepage"
        className="absolute -top-12 -left-4 sm:-left-8 p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition-all duration-300 z-10"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </Link>

      <Suspense fallback={<div className="text-center p-8 text-stone-500">Loading verification...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
