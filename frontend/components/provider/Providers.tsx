"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UIProvider } from "../context/UIContext";
import { AuthProvider } from "../context/auth.context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <AuthProvider>
        <UIProvider>{children}</UIProvider>
      </AuthProvider>
    </TooltipProvider>
  );
};
