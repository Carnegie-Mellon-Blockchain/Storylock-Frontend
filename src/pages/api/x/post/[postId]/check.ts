// src/pages/api/x/post/[postId]/check.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postId } = req.query;

  if (!postId || typeof postId !== "string") {
    return res.status(400).json({ message: "Post ID is required" });
  }

  try {
    // Get base URL from request
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // 1. Fetch post data using fetchPost API
    const postUrl = `https://x.com/i/status/${postId}`;
    const fetchResponse = await fetch(
      `${baseUrl}/api/x/fetchPost?url=${encodeURIComponent(postUrl)}`
    );

    if (!fetchResponse.ok) {
      throw new Error("Failed to fetch post data");
    }

    const postData = await fetchResponse.json();

    if (!postData.image) {
      return res.status(400).json({ message: "No image found in post" });
    }

    // 2. Get image data
    const imageResponse = await fetch(postData.image);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // 3. Check IP using check API
    const checkResponse = await fetch(`${baseUrl}/api/ip/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filedata: base64Image }),
    });

    if (!checkResponse.ok) {
      throw new Error("Failed to check IP");
    }

    const checkData = await checkResponse.json();

    return res.status(200).json({
      post: postData,
      checkResult: checkData,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
