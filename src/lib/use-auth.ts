"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser, type AuthUser } from "@/lib/auth-session";

type UseAuthReturn = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  redirectToLogin: (returnPath: string) => void;
};

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check if authenticated
    const token = getToken();
    const currentUser = getUser();

    if (token && currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const redirectToLogin = (returnPath: string) => {
    const returnUrl = encodeURIComponent(returnPath);
    router.push(`/login?return=${returnUrl}`);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    redirectToLogin,
  };
}

