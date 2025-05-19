import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { KycFlow } from "@/types";

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
      return res.status(400).json({ message: "Missing KYC flow ID" });
    }

    const flow = await kv.get<KycFlow>(`kyc:flow:${id}`);

    if (!flow) {
      return res.status(404).json({ message: "KYC flow not found" });
    }

    if (flow.isDeleted) {
      return res.status(404).json({ message: "KYC flow is no longer active" });
    }

    return res.status(200).json({
      success: true,
      flow,
    });
  } catch (error) {
    console.error("Error fetching KYC flow:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
