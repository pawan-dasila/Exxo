"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/layout/auth/AuthForm";
import { AxiosError } from "axios";
import { ApiError } from "../types";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { data, isLoading, isError, error } = useVerifyEmail(token);
  
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <AuthForm.Header
          title="Invalid Request"
          subtitle="No verification token was provided."
        />
        <div className="flex justify-center my-6">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <Button
          onClick={() => router.push("/sign-up")}
          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          Back to Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      {isLoading && (
        <>
          <AuthForm.Header
            title="Verifying Email"
            subtitle="Please wait while we verify your email address..."
          />
          <div className="flex justify-center my-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        </>
      )}

      {isError && (
        <>
          <AuthForm.Header
            title="Verification Failed"
            subtitle={
              (error as AxiosError<ApiError>)?.response?.data?.message ||
              "The verification link is invalid or has expired."
            }
          />
          <div className="flex justify-center my-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            Go to Sign In
          </Button>
        </>
      )}

      {data && (
        <>
          <AuthForm.Header
            title="Email Verified!"
            subtitle="Your email has been successfully verified. You can now log in to your account."
          />
          <div className="flex justify-center my-6">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
          >
            Continue to Sign In
          </Button>
        </>
      )}
    </div>
  );
}
