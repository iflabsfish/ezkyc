import { useState, useEffect } from "react";
import { useUser } from "@account-kit/react";
import { User, Company } from "@/types";

type UserInfoState = {
  isLoading: boolean;
  error: string | null;
  account: (User | Company) | null;
  accountType: "user" | "company" | null;
};

export function useUserInfo() {
  const user = useUser();
  const [state, setState] = useState<UserInfoState>({
    isLoading: true,
    error: null,
    account: null,
    accountType: null,
  });

  useEffect(() => {
    async function fetchUserInfo() {
      if (!user) {
        setState({
          isLoading: false,
          error: null,
          account: null,
          accountType: null,
        });
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const userId = user.userId;

        const response = await fetch(
          `/api/user/get-account?id=${encodeURIComponent(userId)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to get user information");
        }

        if (data.success) {
          setState({
            isLoading: false,
            error: null,
            account: data.account,
            accountType: data.accountType,
          });
        } else {
          setState({
            isLoading: false,
            error: null,
            account: null,
            accountType: null,
          });
        }
      } catch (error) {
        console.error("Error getting user information:", error);
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          account: null,
          accountType: null,
        });
      }
    }

    fetchUserInfo();
  }, [user]);

  return state;
}
