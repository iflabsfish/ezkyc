import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import { KycFlow, CreateKycFlowRequest, KycFlowInDB } from "@/types";
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

    const flowData: CreateKycFlowRequest = req.body;
    if (!flowData || !flowData.projectName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const flow: KycFlowInDB = {
      ...flowData,
      userId: accountId,
      id: uuidv4(),
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await kv.set(`kyc:flow:${flow.id}`, flow);
    await kv.sadd(`kyc:user:${accountId}`, flow.id);

    return res.status(201).json({
      success: true,
      flow,
    });
  } catch (error) {
    console.error("Error creating KYC flow:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
