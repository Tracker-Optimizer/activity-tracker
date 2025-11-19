"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

export type UseLogoutOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useLogout({
  redirectTo = "/",
  onSuccess,
  onError,
}: UseLogoutOptions = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(redirectTo);
            onSuccess?.();
          },
        },
      });
    } catch (err) {
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [redirectTo, onError, onSuccess, router]);

  const resetError = useCallback(() => setError(null), []);

  return { logout, isLoading, error, resetError };
}
