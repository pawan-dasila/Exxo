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
  registerSchema as signUpSchema,
  type RegisterInput as SignUpFormValues,
} from "@/modules/auth/types/validations";
import { useRegister as useSignUp } from "@/modules/auth/hooks/use-register";
import { useGoogleSignIn } from "@/modules/auth/hooks/use-google-signin";
import { AuthForm } from "@/components/layout/auth/AuthForm";

export function RegisterForm() {
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
          onSubmit={form.handleSubmit((data) => signUp(data))}
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
    </div>
  );
}
