// src/pages/api/ip/check.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filedata } = req.body;

    if (!filedata) {
      return res.status(400).json({ error: "No file data provided" });
    }

    const response = await fetch(
      "http://skynet88-supermario.andrew.cmu.edu:8000/api/check_ip",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `filedata=${encodeURIComponent(filedata)}`,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error checking IP:", error);
    return res.status(500).json({ error: "Failed to check IP" });
  }
}
