import { useAuthUserContext } from "@/app/context/AuthUserContext";

export function useUserInfo() {
  const { userInfo } = useAuthUserContext();

  return userInfo;
}
