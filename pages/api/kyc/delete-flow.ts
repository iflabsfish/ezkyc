import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { KycFlow } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Missing flow ID" });
    }

    const flow = await kv.get<KycFlow>(`kyc:flow:${id}`);

    if (!flow) {
      return res.status(404).json({ message: "KYC flow not found" });
    }

    const updatedFlow: KycFlow = {
      ...flow,
      isDeleted: true,
      updatedAt: Date.now(),
    };

    await kv.set(`kyc:flow:${id}`, updatedFlow);

    return res.status(200).json({
      success: true,
      message: "KYC flow deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting KYC flow:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
