import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { KycFlow } from "@/types";
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

    const flowIds = await kv.smembers(`kyc:user:${accountId}`);

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
