"use client";

import React from "react";
import {
  Settings,
  LogOut,
  UserCircle,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/auth.context";

export const UserProfile = () => {
  const { user, clearAuth, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-12 w-[160px] flex items-center gap-3 px-3 animate-pulse">
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-none shrink-0" />
        <div className="hidden md:flex flex-col gap-1.5 flex-1">
          <div className="h-2 w-20 bg-slate-200 dark:bg-slate-800 rounded-none" />
          <div className="h-2 w-24 bg-slate-100 dark:bg-slate-900 rounded-none" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push("/sign-in")}>
          Log in
        </Button>
        <Button onClick={() => router.push("/sign-up")}>
          Sign up
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    clearAuth();
    router.push("/sign-in");
  };

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "U";
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 px-2 h-10 w-auto rounded-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted overflow-hidden">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={fullName}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <div className="hidden md:flex flex-col items-start gap-0.5 leading-none">
            <span className="text-sm font-medium">{fullName}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              {user.role === "ADMIN" && (
                <ShieldCheck className="h-3 w-3 text-primary" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/accounts")}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile Details</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/accounts")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>User Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/accounts")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
