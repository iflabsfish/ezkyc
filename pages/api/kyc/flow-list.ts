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
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const flowIds = await kv.smembers(`kyc:user:${userId}`);

    if (!flowIds || flowIds.length === 0) {
      return res.status(200).json({
        success: true,
        flows: [],
      });
    }

    const flowPromises = flowIds.map((id: string) =>
      kv.get<KycFlow>(`kyc:flow:${id}`)
    );
    const flows = await Promise.all(flowPromises);

    const validFlows = flows
      .filter((flow): flow is KycFlow => flow !== null)
      .filter((flow: KycFlow) => !flow.isDeleted);

    validFlows.sort((a: KycFlow, b: KycFlow) => b.createdAt - a.createdAt);

    return res.status(200).json({
      success: true,
      flows: validFlows,
    });
  } catch (error) {
    console.error("Error fetching KYC flows:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
