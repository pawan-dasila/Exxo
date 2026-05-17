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

  if (!user) return null;

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "U";
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-auto flex items-center gap-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-none transition-all duration-300 group"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors duration-300">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={fullName}
                width={36}
                height={36}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span className="text-xs font-bold tracking-widest text-slate-500">
                {initials}
              </span>
            )}
          </div>
          <div className="hidden md:flex flex-col items-start gap-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 line-clamp-1">
              {fullName}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-tight line-clamp-1">
              {user.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 rounded-none shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-50">
                {fullName}
              </p>
              {user.role === "ADMIN" && (
                <ShieldCheck className="h-3 w-3 text-primary" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-900" />

        <div className="py-2">
          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="px-5 py-3 cursor-pointer rounded-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
          >
            <UserCircle className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100">
              Profile Details
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="px-5 py-3 cursor-pointer rounded-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100">
              User Dashboard
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="px-5 py-3 cursor-pointer rounded-none focus:bg-slate-50 dark:focus:bg-slate-900 group"
          >
            <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100">
              Account Settings
            </span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-900" />

        <div className="py-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="px-5 py-3 cursor-pointer rounded-none focus:bg-red-50 dark:focus:bg-red-950/30 group"
          >
            <LogOut className="mr-3 h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400">
              Sign Out
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
