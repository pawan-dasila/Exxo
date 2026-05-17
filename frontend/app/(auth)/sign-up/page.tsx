import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create Account — Exxo",
  description:
    "Join the Exxo community to start renting premium items from your neighbors.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        aria-label="Return to Homepage"
        className="absolute -top-12 -left-4 sm:-left-8 p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition-all duration-300 z-10"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </Link>

      <RegisterForm />
    </div>
  );
}
