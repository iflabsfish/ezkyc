import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import {
  UserKycVerification,
  KycFlowInDBWithStats,
  KycFlowInDB,
} from "@/types";
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
      kv.get<KycFlowInDB>(`kyc:flow:${id}`)
    );
    const flows = await Promise.all(flowPromises);

    const validFlows = flows
      .filter((flow) => flow !== null)
      .filter((flow: KycFlowInDB) => !flow.isDeleted);

    const flowsWithStats: KycFlowInDBWithStats[] = await Promise.all(
      validFlows.map(async (flow) => {
        const verificationIds = await kv.smembers(
          `kyc:flow:verifications:${flow.id}`
        );

        if (!verificationIds || verificationIds.length === 0) {
          return {
            ...flow,
            participantCount: 0,
            completedCount: 0,
          };
        }

        const verificationPromises = verificationIds.map((id: string) =>
          kv.get<UserKycVerification>(`kyc:verification:${id}`)
        );
        const verifications = await Promise.all(verificationPromises);

        const validVerifications = verifications
          .filter((v): v is UserKycVerification => v !== null)
          .filter((v) => !v.isDeleted);

        const participantCount = validVerifications.length;
        const completedCount = validVerifications.filter(
          (v) => v.status === "approved"
        ).length;

        return {
          ...flow,
          participantCount,
          completedCount,
        };
      })
    );

    flowsWithStats.sort(
      (a: KycFlowInDBWithStats, b: KycFlowInDBWithStats) =>
        b.createdAt - a.createdAt
    );

    return res.status(200).json({
      success: true,
      flows: flowsWithStats,
    });
  } catch (error) {
    console.error("Error fetching KYC flows:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
