import { Company } from "./companies";
import { User } from "./users";

export type UserInfoState = {
  isLoading: boolean;
  error: string | null;
  account: (User | Company) | null;
  accountType: "user" | "company" | null;
};
