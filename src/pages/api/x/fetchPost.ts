// src/pages/api/x/fetchPost.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Rettiwt } from "rettiwt-api";

interface FormData {
  title: string;
  description: string;
  image: string;
  type: string;
  author: string;
  timestamp: string;
  permanentUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "URL parameter is required" });
  }

  try {
    // Extract tweet ID from URL
    const tweetId = url.split("/status/")[1]?.split("?")[0];

    if (!tweetId) {
      return res.status(400).json({ message: "Invalid Twitter URL" });
    }

    const rettiwt = new Rettiwt({ apiKey: process.env.TWITTER_COOKIES });
    const tweet = await rettiwt.tweet.details(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Format response according to FormData structure
    const formattedResponse: FormData = {
      title: `${tweet.tweetBy.userName}'s X Post`,
      description: tweet.fullText || "",
      image: tweet.media?.[0]?.url || "",
      type: "tweet",
      author: tweet.tweetBy.userName || "Unknown Author",
      timestamp: tweet.createdAt || new Date().toISOString(),
      permanentUrl: url,
    };

    return res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    return res.status(500).json({ message: "Error fetching tweet data" });
  }
}
