import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { UserKycVerification } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, userId } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Missing verification ID" });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const verification = await kv.get<UserKycVerification>(
      `kyc:verification:${id}`
    );

    if (!verification) {
      return res.status(404).json({ message: "KYC verification not found" });
    }

    if (verification.userId !== userId) {
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
