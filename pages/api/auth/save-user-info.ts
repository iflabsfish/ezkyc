import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userData = req.body;
    const userId = userData.userId;

    if (!userId) {
      return res.status(400).json({ message: "Address is required" });
    }

    let accountId = await kv.get<string>(`userId:accountId:${userId}`);
    let isNewUser = false;

    if (!accountId) {
      accountId = uuidv4().toLowerCase();
      isNewUser = true;
      await kv.set(`userId:accountId:${userId}`, accountId);
    }

    const userDataToSave = {
      ...userData,
      userId,
      accountId,
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };
    await kv.hset(accountId, userDataToSave);

    const jwtSecret = getJwtSecret();
    const token = jwt.sign({ accountId }, jwtSecret, { expiresIn: "1d" });

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser
        ? "User information created"
        : "User information updated",
      isNewUser,
      accountId,
      token,
    });
  } catch (error) {
    console.error("Save user info error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
