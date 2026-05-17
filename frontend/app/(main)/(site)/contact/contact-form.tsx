"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSubmissionSchema,
  type ContactSubmissionFormValues,
} from "@/modules/support/types";
import { useSubmitContactForm } from "@/modules/support/hooks";

export function ContactForm() {
  const { mutate: submitForm, isPending, isSuccess } = useSubmitContactForm();

  const form = useForm<ContactSubmissionFormValues>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      subject: "",
      order_id: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactSubmissionFormValues) => {
    submitForm(data);
  };

  if (isSuccess) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-serif text-[#090A0A] tracking-tight">
          Message Received
        </h3>
        <p className="text-base font-sans text-stone-500 leading-relaxed max-w-sm">
          Thank you for reaching out. A member of our team will get back to you
          at the email provided within 48 business hours.
        </p>
        <Button
          variant="outline"
          onClick={() => form.reset()}
          className="mt-8 rounded-full border-[#090A0A] text-[#090A0A] hover:bg-[#090A0A] hover:text-white transition-all px-8 uppercase tracking-widest text-xs font-bold"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-in fade-in duration-500"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                  First Name <span className="text-brand-gold">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                  Last Name <span className="text-brand-gold">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all"
                  />
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
            <FormItem className="space-y-3">
              <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                Email Address <span className="text-brand-gold">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={isPending}
                  className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="tel"
                  disabled={isPending}
                  className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                Subject / Category <span className="text-brand-gold">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus:ring-1 focus:ring-[var(--brand-gold)] focus:border-brand-gold transition-all">
                    <SelectValue placeholder="What is this regarding?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-none border-stone-200">
                  <SelectItem value="order">Order Inquiry</SelectItem>
                  <SelectItem value="return">Return & Exchange</SelectItem>
                  <SelectItem value="product">Product Information</SelectItem>
                  <SelectItem value="grievance">
                    Grievance Registration
                  </SelectItem>
                  <SelectItem value="other">Other Concerns</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_id"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                Order ID
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. VESTRO-12345"
                  disabled={isPending}
                  className="h-14 rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all placeholder:text-stone-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xs uppercase font-bold tracking-widest text-[#090A0A]">
                Your Message <span className="text-brand-gold">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  className="min-h-[160px] resize-y rounded-none border-stone-200 bg-stone-50/50 focus-visible:ring-1 focus-visible:ring-[var(--brand-gold)] focus-visible:border-brand-gold transition-all p-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-12 h-14 rounded-full text-md uppercase transition-all duration-300"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

