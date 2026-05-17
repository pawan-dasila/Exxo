"use client";

import { createContext, use, useEffect, useCallback } from "react";

import { axiosInstance } from "@/hooks/use-axios";

import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/modules/user/types";
import { AuthResponse } from "@/modules/auth/types";
import { useProfile } from "@/modules/auth/hooks/use-profile";
import { logger } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useProfile();

  // Sync localStorage when profile changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem("auth_user", JSON.stringify(profile));
    } else if (profile === null) {
      localStorage.removeItem("auth_user");
    }
  }, [profile]);

  const setAuth = useCallback(
    (data: AuthResponse) => {
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      queryClient.setQueryData(["user", "profile"], data.user);
    },
    [queryClient],
  );

  const clearAuth = useCallback(() => {
    localStorage.removeItem("auth_user");
    queryClient.setQueryData(["user", "profile"], null);
    queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      logger.error("Logout request failed", error, { module: "AuthContext" });
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    const handleLogout = () => {
      clearAuth();
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user: profile ?? null,
        isLoading,
        setAuth,
        clearAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
