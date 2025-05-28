import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { UserKycVerification, KycFlowInDB } from "@/types";
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

    const { kycFlowId } = req.query;

    if (!kycFlowId) {
      return res.status(400).json({ message: "Missing kycFlowId parameter" });
    }

    const flow = await kv.get<KycFlowInDB>(`kyc:flow:${kycFlowId}`);

    if (!flow) {
      return res.status(404).json({ message: "KYC flow not found" });
    }

    if (flow.isDeleted) {
      return res.status(404).json({ message: "KYC flow is no longer active" });
    }

    if (flow.userId !== accountId) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this flow" });
    }

    const verificationIds = await kv.smembers(
      `kyc:flow:verifications:${kycFlowId}`
    );

    if (!verificationIds || verificationIds.length === 0) {
      return res.status(200).json({
        success: true,
        flow: {
          id: flow.id,
          projectName: flow.projectName,
          startDate: flow.startDate,
          endDate: flow.endDate,
        },
        addresses: {
          pending: [],
          approved: [],
          rejected: [],
        },
        totalCount: 0,
      });
    }

    const verificationPromises = verificationIds.map((id: string) =>
      kv.get<UserKycVerification>(`kyc:verification:${id}`)
    );
    const verifications = await Promise.all(verificationPromises);

    const validVerifications = verifications.filter(
      (v): v is UserKycVerification => v !== null
    );

    const pendingAddresses = validVerifications
      .filter((v) => !v.isDeleted && v.status === "pending")
      .map((v) => ({
        blockchainAddress: v.blockchainAddress,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        verificationId: v.id,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    const approvedAddresses = validVerifications
      .filter((v) => v.status === "approved")
      .map((v) => ({
        blockchainAddress: v.blockchainAddress,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        verificationId: v.id,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);

    const rejectedAddresses = validVerifications
      .filter((v) => v.status === "rejected")
      .map((v) => ({
        blockchainAddress: v.blockchainAddress,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        verificationId: v.id,
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return res.status(200).json({
      success: true,
      flow: {
        id: flow.id,
        projectName: flow.projectName,
        startDate: flow.startDate,
        endDate: flow.endDate,
      },
      addresses: {
        pending: pendingAddresses,
        approved: approvedAddresses,
        rejected: rejectedAddresses,
      },
      totalCount:
        pendingAddresses.length +
        approvedAddresses.length +
        rejectedAddresses.length,
    });
  } catch (error) {
    console.error("Error fetching flow addresses:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
