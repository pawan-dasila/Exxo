import React from "react";
import { getCurrentUserWithProfileAction } from "@/modules/users/actions";
import { redirect } from "next/navigation";
import { AccountNav } from "@/modules/users/components/AccountNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Vestrostyles",
    default: "My Account — Vestrostyles",
  },
  description:
    "Manage your Vestrostyles boutique account, orders, and addresses.",
};

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await getCurrentUserWithProfileAction();

  if (!user) {
    redirect("/sign-in?next=/accounts");
  }

  return (
    <div className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-16">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 lg:sticky lg:top-32 self-start shrink-0">
          <div className="lg:pr-8 space-y-12">
            <header className="space-y-2">
              <h1 className="text-3xl font-italiana text-foreground uppercase tracking-tight">
                Account
              </h1>
              <div className="h-px w-12 bg-primary/20" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                Identity & Transactions
              </p>
            </header>

            <AccountNav />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 mt-1 lg:mt-0 pt-2">{children}</main>
      </div>
    </div>
  );
}
