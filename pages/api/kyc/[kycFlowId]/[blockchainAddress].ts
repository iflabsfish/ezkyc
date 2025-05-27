import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { UserKycVerification, KycFlowInDB } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { kycFlowId, blockchainAddress } = req.query;

    if (!kycFlowId || !blockchainAddress) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const normalizedAddress = (blockchainAddress as string).toLowerCase();

    const flow = await kv.get<KycFlowInDB>(`kyc:flow:${kycFlowId}`);

    if (!flow) {
      return res.status(404).json({ message: "KYC flow not found" });
    }

    if (flow.isDeleted) {
      return res.status(404).json({ message: "KYC flow is no longer active" });
    }

    const verification = await kv.get<UserKycVerification>(
      `kyc:flow:${kycFlowId}:address:${normalizedAddress}`
    );

    if (!verification || verification.isDeleted) {
      return res.status(404).json({
        message: "No verification found for this address in this flow",
        status: "not_found",
      });
    }

    return res.status(200).json({
      success: true,
      verification: {
        id: verification.id,
        kycFlowId: verification.kycFlowId,
        blockchainAddress: verification.blockchainAddress,
        status: verification.status,
        createdAt: verification.createdAt,
        updatedAt: verification.updatedAt,
      },
      flow: {
        id: flow.id,
        projectName: flow.projectName,
        startDate: flow.startDate,
        endDate: flow.endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching verification status:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
