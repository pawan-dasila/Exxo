import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AuthFormHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const Header = ({ title, subtitle, className }: AuthFormHeaderProps) => (
  <header className={cn("text-center space-y-2 animate-fade-in-up delay-100", className)}>
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 font-italiana">
      {title}
    </h1>
    <p className="text-sm text-stone-500">
      {subtitle}
    </p>
  </header>
);

interface AuthSocialLoginProps {
  onGoogleClick: () => void;
  isLoading?: boolean;
  className?: string;
  type?: "sign-in" | "sign-up";
}

const Social = ({ onGoogleClick, isLoading, className, type = "sign-in" }: AuthSocialLoginProps) => (
  <div className={cn("grid grid-cols-1 gap-4 animate-fade-in-up delay-200", className)}>
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      type="button"
      onClick={onGoogleClick}
      aria-label={type === "sign-in" ? "Sign in with Google" : "Sign up with Google"}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 mr-3"
          aria-hidden="true"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      Google
    </Button>
  </div>
);

const FormSeparator = ({ text = "or continue with" }: { text?: string }) => (
  <div className="relative" role="presentation">
    <div className="absolute inset-0 flex items-center">
      <Separator />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-white px-2 text-muted-foreground font-medium">
        {text}
      </span>
    </div>
  </div>
);

interface AuthFormFooterProps {
  text: string;
  linkText: string;
  href: string;
  className?: string;
}

const Footer = ({ text, linkText, href, className }: AuthFormFooterProps) => (
  <p className={cn("text-center text-sm text-muted-foreground animate-fade-in-up delay-400", className)}>
    {text}{" "}
    <Link
      href={href}
      className="text-primary font-semibold hover:text-primary underline underline-offset-4 decoration-stone-200 hover:decoration-primary transition-all"
    >
      {linkText}
    </Link>
  </p>
);

export const AuthForm = {
  Header,
  Social,
  Separator: FormSeparator,
  Footer,
};
