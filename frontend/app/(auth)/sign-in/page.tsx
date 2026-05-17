import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login — Exxo",
  description:
    "Sign in to your Exxo account to manage your rentals and preferences.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        aria-label="Return to Homepage"
        className="absolute -top-12 -left-4 sm:-left-8 p-2 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition-all duration-300 z-10"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </Link>

      <LoginForm />
    </div>
  );
}
