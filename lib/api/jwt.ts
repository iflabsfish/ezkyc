import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/api/env";

export function verifyJwt(token: string): { accountId: string } | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { accountId: string };
    return decoded;
  } catch {
    return null;
  }
}
