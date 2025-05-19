import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userData = req.body;
    const userId = userData.userId || userData.address;
    const address = userData.address;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const userExists = await kv.exists(userId);

    if (!userExists) {
      console.log("Creating new user record:", userId);

      const userDataToSave = {
        ...userData,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };

      await kv.hset(userId, userDataToSave);

      return res.status(201).json({
        success: true,
        message: "User information created",
        isNewUser: true,
      });
    } else {
      await kv.hset(userId, {
        ...userData,
        lastLogin: Date.now(),
      });

      const currentUserData = await kv.hgetall(userId);

      return res.status(200).json({
        success: true,
        message: "User information updated",
        isNewUser: false,
        userData: currentUserData,
      });
    }
  } catch (error) {
    console.error("Save user info error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
