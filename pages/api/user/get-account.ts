import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { User, Company, AccountType } from "@/types";
import { verifyJwt } from "@/lib/api/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const accountId = payload.accountId;

    const userAccount = await kv.get<User>(`user:${accountId}`);
    if (userAccount) {
      return res.status(200).json({
        success: true,
        account: userAccount,
        accountType: "user",
      });
    }

    const companyAccount = await kv.get<Company>(`company:${accountId}`);
    if (companyAccount) {
      return res.status(200).json({
        success: true,
        account: companyAccount,
        accountType: "company",
      });
    }

    return res.status(404).json({
      success: false,
      message: "Account information not found",
    });
  } catch (error) {
    console.error("Error getting account information:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
