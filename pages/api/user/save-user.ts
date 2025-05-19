import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { User } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, name, email, type } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (type !== "user") {
      return res.status(400).json({ message: "Type must be user" });
    }

    const user: User = {
      id,
      name,
      email: email || undefined,
      type: "user",
      createdAt: Date.now(),
    };

    await kv.set(`user:${id}`, user);

    return res.status(201).json({
      success: true,
      message: "User information saved successfully",
      user,
    });
  } catch (error) {
    console.error("Error saving user information:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
