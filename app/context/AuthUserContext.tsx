import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
  useCallback,
} from "react";
import { useUser, UseUserResult } from "@account-kit/react";
import { UserInfoState } from "@/types";

function getTokenKey(userId: string) {
  return `ezkyc_jwt_token_${userId}`;
}

function getAccountIdKey(userId: string) {
  return `ezkyc_account_id_${userId}`;
}

function getUserInfoKey(userId: string) {
  return `ezkyc_user_info_${userId}`;
}

interface AuthUserContextType {
  accountId: string | null;
  userInfo: UserInfoState;
  setUserInfo: (info: UserInfoState) => void;
  token: string | null;
  setTokenAndAccountId: (
    token: string | null,
    accountId: string | null
  ) => void;
  saveUser: (userData: UseUserResult) => Promise<void>;
  isSavingUser: boolean;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(
  undefined
);

export const AuthUserProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const user = useUser();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    isLoading: true,
    error: null,
    account: null,
    accountType: null,
  });
  const [token, setToken] = useState<string | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  const setTokenAndAccountId = useCallback(
    (token: string | null, accountId: string | null) => {
      setToken(token);
      setAccountId(accountId);
      if (user?.userId) {
        if (token && accountId) {
          localStorage.setItem(getTokenKey(user.userId), token);
          localStorage.setItem(getAccountIdKey(user.userId), accountId);
        }
        if (!token || !accountId) {
          localStorage.removeItem(getTokenKey(user.userId));
          localStorage.removeItem(getAccountIdKey(user.userId));
        }
      }
    },
    [user?.userId]
  );

  const setUserInfoInContext = useCallback(
    (userInfo: UserInfoState) => {
      setUserInfo(userInfo);
      if (user?.userId) {
        localStorage.setItem(
          getUserInfoKey(user.userId),
          JSON.stringify(userInfo)
        );
      }
    },
    [user?.userId]
  );

  const saveUser = useCallback(
    async (userData: UseUserResult) => {
      try {
        if (!userData?.userId) {
          throw new Error("Invalid user data");
        }

        setIsSavingUser(true);

        const response = await fetch("/api/auth/save-user-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (result.token && result.accountId) {
          setTokenAndAccountId(result.token, result.accountId);
        }
      } catch (error) {
        throw new Error("Error saving user info " + error);
      } finally {
        setIsSavingUser(false);
      }
    },
    [setTokenAndAccountId]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && user?.userId) {
      const storedToken = localStorage.getItem(getTokenKey(user.userId));
      const storedAccountId = localStorage.getItem(
        getAccountIdKey(user.userId)
      );
      if (storedToken && storedAccountId) {
        setTokenAndAccountId(storedToken, storedAccountId);
        const storedUserInfo = localStorage.getItem(
          getUserInfoKey(user.userId)
        );
        if (storedUserInfo) {
          const storedUserInfoObj = JSON.parse(storedUserInfo) as UserInfoState;
          if (
            !storedUserInfoObj.isLoading &&
            !storedUserInfoObj.error &&
            storedUserInfoObj.account?.id === storedAccountId
          ) {
            setUserInfo(storedUserInfoObj);
          }
        }
      }
    }
  }, [user?.userId, setTokenAndAccountId]);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!accountId || !token) {
        setUserInfo({
          isLoading: false,
          error: null,
          account: null,
          accountType: null,
        });
        return;
      }

      try {
        setUserInfo((prev: UserInfoState) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));
        const response = await fetch("/api/user/get-account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response?.json();

        if (!response?.ok) {
          if (response?.status === 404) {
            setUserInfo({
              isLoading: false,
              error: null,
              account: null,
              accountType: null,
            });
            return;
          }
          throw new Error(data.message || "Failed to get user information");
        }

        if (data.success) {
          setUserInfo({
            isLoading: false,
            error: null,
            account: data.account,
            accountType: data.accountType,
          });
        } else {
          setUserInfo({
            isLoading: false,
            error: null,
            account: null,
            accountType: null,
          });
        }
      } catch (error) {
        console.error("Error getting user information:", error);
        setUserInfo({
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          account: null,
          accountType: null,
        });
      }
    }

    fetchUserInfo();
  }, [accountId]);

  return (
    <AuthUserContext.Provider
      value={{
        accountId,
        token,
        setTokenAndAccountId,
        userInfo,
        setUserInfo: setUserInfoInContext,
        saveUser,
        isSavingUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export function useAuthUserContext() {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useAuthUser must be used within AuthUserProvider");
  return ctx;
}
