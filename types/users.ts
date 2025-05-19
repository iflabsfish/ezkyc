export interface User {
  id: string;
  name: string;
  email?: string;
  dateOfBirth?: string;
  country?: string;
  type: "user";
  createdAt: number;
}
