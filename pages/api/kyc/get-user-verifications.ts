import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import {
  UserKycVerification,
  KycFlow,
  UserKycVerificationWithFlow,
  KycFlowInDB,
} from "@/types";

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

    const verificationIds = await kv.smembers(`user:kyc:${userId.toLowerCase()}`);

    if (!verificationIds || verificationIds.length === 0) {
      return res.status(200).json({
        success: true,
        verifications: [],
      });
    }

    const verificationPromises = verificationIds.map((id: string) =>
      kv.get<UserKycVerification>(`kyc:verification:${id}`)
    );
    const verifications = await Promise.all(verificationPromises);

    const validVerifications = verifications
      .filter((v): v is UserKycVerification => v !== null)
      .filter((v) => !v.isDeleted);

    const verificationsWithFlowPromises = validVerifications.map(async (v) => {
      const flow = await kv.get<KycFlowInDB>(`kyc:flow:${v.kycFlowId}`);

      if (!flow || flow.isDeleted) {
        return null;
      }

      return {
        ...v,
        flow,
      } as UserKycVerificationWithFlow;
    });

    const verificationsWithFlow = (
      await Promise.all(verificationsWithFlowPromises)
    ).filter((v): v is UserKycVerificationWithFlow => v !== null);

    verificationsWithFlow.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      success: true,
      verifications: verificationsWithFlow,
    });
  } catch (error) {
    console.error("Error fetching user KYC verifications:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
