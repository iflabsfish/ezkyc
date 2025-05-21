import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { Company } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, name, logo, website, type } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    if (type !== "company") {
      return res.status(400).json({ message: "Type must be company" });
    }

    const company: Company = {
      id: id.toLowerCase(),
      name,
      logo: logo || undefined,
      website: website || undefined,
      type: "company",
      createdAt: Date.now(),
    };

    await kv.set(`company:${id.toLowerCase()}`, company);

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
