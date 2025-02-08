// src/components/CheckIp.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { IPayload } from "@/types/IPayload";

interface CheckIpProps {
  imageUrl: string;
  onSimilarIpFound: (similarIp: IPayload[]) => void;
}

const CheckIp: React.FC<CheckIpProps> = ({ imageUrl, onSimilarIpFound }) => {
  const [similarIp, setSimilarIp] = useState<IPayload[]>([]);

  const handleCheckIP = async () => {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");

      const response = await fetch("/api/ip/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filedata: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Failed to check IP");
      }

      const data = await response.json();
      const foundIps = data.results
        .filter((result: any) => result.score > 0.8)
        .map((result: any) => result.payload as IPayload);

      setSimilarIp(foundIps);
      onSimilarIpFound(foundIps);
      toast.info("IP check completed");
    } catch (error) {
      console.error("Error checking IP:", error);
      toast.error("Failed to check IP");
    }
  };

  return (
    <button
      onClick={handleCheckIP}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Check IP
    </button>
  );
};

export default CheckIp;
