import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { User, Company, AccountType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userAccount = await kv.get<User>(`user:${id.toLowerCase()}`);
    if (userAccount) {
      return res.status(200).json({
        success: true,
        account: userAccount,
        accountType: "user",
      });
    }

    const companyAccount = await kv.get<Company>(`company:${id.toLowerCase()}`);
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
