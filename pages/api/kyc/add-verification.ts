import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import {
  UserKycVerification,
  KycFlow,
  CreateUserKycVerificationRequest,
  KycFlowInDB,
} from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const verificationData: CreateUserKycVerificationRequest = req.body;

    if (
      !verificationData ||
      !verificationData.userId ||
      !verificationData.kycFlowId ||
      !verificationData.blockchainAddress ||
      !verificationData.qrcodeData
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const flow = await kv.get<KycFlowInDB>(
      `kyc:flow:${verificationData.kycFlowId}`
    );

    if (!flow) {
      return res.status(404).json({ message: "KYC flow not found" });
    }

    if (flow.isDeleted) {
      return res.status(400).json({ message: "KYC flow is no longer active" });
    }

    const userVerifications = await kv.smembers(
      `user:kyc:${verificationData.userId}`
    );

    for (const verificationId of userVerifications) {
      const verification = await kv.get<UserKycVerification>(
        `kyc:verification:${verificationId}`
      );

      if (
        verification &&
        verification.kycFlowId === verificationData.kycFlowId &&
        !verification.isDeleted
      ) {
        return res.status(400).json({
          message: "You have already submitted verification for this KYC flow",
        });
      }
    }

    const verification: UserKycVerification = {
      id: uuidv4(),
      userId: verificationData.userId.toLowerCase(),
      kycFlowId: verificationData.kycFlowId,
      blockchainAddress: verificationData.blockchainAddress,
      qrcodeData: verificationData.qrcodeData,
      status: "pending",
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await kv.set(`kyc:verification:${verification.id}`, verification);

    await kv.sadd(`user:kyc:${verification.userId}`, verification.id);

    await kv.sadd(
      `kyc:flow:verifications:${verification.kycFlowId}`,
      verification.id
    );

    return res.status(201).json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error("Error creating KYC verification:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
