"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema as signUpSchema,
  type RegisterInput as SignUpFormValues,
} from "@/modules/auth/types/validations";
import { useRegister as useSignUp } from "@/modules/auth/hooks/use-register";
import { useGoogleSignIn } from "@/modules/auth/hooks/use-google-signin";
import { AuthForm } from "@/components/layout/auth/AuthForm";

import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const { mutate: signUp, isPending } = useSignUp();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  return (
    <div className="space-y-6">
      <AuthForm.Header
        title="Create an account"
        subtitle="Join us to get started with your premium experience."
      />

      <AuthForm.Social
        onGoogleClick={signInWithGoogle}
        isLoading={isGoogleLoading}
        type="sign-up"
      />

      <AuthForm.Separator text="or Sign up with Email" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            signUp(data, {
              onSuccess: () => setShowVerifyDialog(true),
            }),
          )}
          className="space-y-4 animate-fade-in-up delay-300"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-stone-700 font-medium ml-1 text-xs">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-stone-700 font-medium ml-1 text-xs">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-stone-700 font-medium ml-1 text-xs">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="mail@abc.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-stone-700 font-medium ml-1 text-xs">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      disabled={isPending}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm text-stone-600 font-normal leading-relaxed cursor-pointer select-none">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-stone-900 font-medium underline underline-offset-4 hover:text-stone-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage className="text-xs text-red-500 font-medium" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <AuthForm.Footer
        text="Already have an account?"
        linkText="Log in"
        href="/sign-in"
      />

      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md text-center border-0 shadow-2xl p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">
              Check your email
            </DialogTitle>
            <DialogDescription className="text-base text-stone-600 leading-relaxed">
              We&apos;ve sent a verification link to{" "}
              <span className="font-semibold text-stone-900">
                {form.getValues().email}
              </span>
              . Please verify your email address to complete your registration
              and log in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              type="button"
              className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90"
              onClick={() => router.push("/sign-in")}
            >
              Go to Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
