import { useRouter } from "next/navigation";
import { cookieToInitialState } from "@account-kit/core";
import { config } from "@/config";
import { useState, useCallback } from "react";

export function useAuth() {
  const router = useRouter();
  const [isSavingUserInfo, setIsSavingUserInfo] = useState(false);

  const saveUserInfo = useCallback(
    async (userData: any) => {
      try {
        if (!userData || !userData.address) {
          console.error("Invalid user data");
          router.push("/destinations");
          return;
        }

        setIsSavingUserInfo(true);

        const response = await fetch("/api/auth/save-user-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        const state = cookieToInitialState(
          config,
          document.cookie ?? undefined
        );

        router.push("/destinations");
      } catch (error) {
        console.error("Error saving user info:", error);
        router.push("/destinations");
      } finally {
        setIsSavingUserInfo(false);
      }
    },
    [router]
  );

  return {
    saveUserInfo,
    isSavingUserInfo,
  };
}
