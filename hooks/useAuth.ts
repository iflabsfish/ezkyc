import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { useAuthUserContext } from "@/app/context/AuthUserContext";

export function useAuth() {
  const router = useRouter();
  const { accountId, token } = useAuthUserContext();

  const fetchWithToken = useCallback(
    async (input: RequestInfo, init: RequestInit = {}) => {
      if (!token) {
        throw new Error("Sign in first.");
      }
      const headers = new Headers(init.headers || {});
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      try {
        const response = await fetch(input, { ...init, headers });
        if (response.status === 401 || response.status === 403) {
          router.push("/");
          return null;
        }
        return response;
      } catch (error) {
        router.push("/");
        return null;
      }
    },
    [router, token]
  );

  return {
    fetchWithToken,
    accountId,
  };
}
