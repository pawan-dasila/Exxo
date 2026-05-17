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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema as signInSchema,
  type LoginInput as SignInFormValues,
} from "@/modules/auth/types/validations";
import { useLogin as useSignIn } from "@/modules/auth/hooks/use-login";
import { useGoogleSignIn } from "@/modules/auth/hooks/use-google-signin";
import { AuthForm } from "@/components/layout/auth/AuthForm";

export function LoginForm() {
  const { mutate: signIn, isPending } = useSignIn();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  return (
    <div className="space-y-6">
      <AuthForm.Header
        title="Login to your Account"
        subtitle="Enter your details to access your account."
      />

      <AuthForm.Social
        onGoogleClick={signInWithGoogle}
        isLoading={isGoogleLoading}
        type="sign-in"
      />

      <AuthForm.Separator text="or Sign in with Email" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => signIn(data))}
          className="space-y-4 animate-fade-in-up delay-300"
        >
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

          <div className="flex items-center justify-between px-1">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormLabel className="text-xs text-stone-500 cursor-pointer font-normal">
                    Remember Me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-stone-500 hover:text-black transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <AuthForm.Footer
        text="Not Registered Yet?"
        linkText="Create an account"
        href="/sign-up"
      />
    </div>
  );
}
