export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  type: "company";
  createdAt: number;
}
