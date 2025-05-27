import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { UserKycVerification } from "@/types";
import { verifyJwt } from "@/lib/api/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
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

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Missing verification ID" });
    }

    const verification = await kv.get<UserKycVerification>(
      `kyc:verification:${id}`
    );

    if (!verification) {
      return res.status(404).json({ message: "KYC verification not found" });
    }

    if (verification.userId !== accountId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this verification" });
    }

    const updatedVerification: UserKycVerification = {
      ...verification,
      isDeleted: true,
      updatedAt: Date.now(),
    };

    await kv.set(`kyc:verification:${id}`, updatedVerification);

    await kv.del(
      `kyc:flow:${
        verification.kycFlowId
      }:address:${verification.blockchainAddress.toLowerCase()}`
    );

    return res.status(200).json({
      success: true,
      message: "KYC verification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting KYC verification:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
