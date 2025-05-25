import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { Company } from "@/types";
import { verifyJwt } from "@/lib/api/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

    const { name, logo, website, type } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    if (type !== "company") {
      return res.status(400).json({ message: "Type must be company" });
    }

    const company: Company = {
      id: accountId,
      name,
      logo: logo || undefined,
      website: website || undefined,
      type: "company",
      createdAt: Date.now(),
    };

    await kv.set(`company:${accountId}`, company);

    return res.status(201).json({
      success: true,
      message: "Company information saved successfully",
      company,
    });
  } catch (error) {
    console.error("Error saving company information:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
