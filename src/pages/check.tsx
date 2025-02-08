// src/pages/check.tsx
import { useState } from "react";
import { toast } from "react-toastify";

import Header from "../components/Header";
import SimilarIpList from "../components/SimilarIpList";
import { IPayload } from "@/types/IPayload";

export default function Check() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCheckCompleted, setIsCheckCompleted] = useState(false);
  const [similarIp, setSimilarIp] = useState<IPayload[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      try {
        setImageData(url);
      } catch (error) {
        toast.error("Failed to load image from URL");
      }
    } else {
      setImageData(null);
    }
  };

  const handleCheck = async () => {
    if (!imageData) {
      toast.error("Please provide an image first");
      return;
    }

    try {
      let base64Data;
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        base64Data = Buffer.from(imageBuffer).toString("base64");
      } else {
        base64Data = imageData;
      }

      const response = await fetch("/api/ip/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filedata: base64Data }),
      });

      if (!response.ok) {
        throw new Error("Failed to check IP");
      }

      const data = await response.json();
      console.log("IP Check Result:", data);
      const filteredResults = data.results
        .filter((result: any) => result.score > 0.8)
        .map((result: any) => ({
          ...result.payload,
          score: result.score,
        })) as IPayload[];

      setSimilarIp(filteredResults);
      setIsCheckCompleted(true);
      toast.info("IP check completed");
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const handleTryAnother = () => {
    setImageData(null);
    setImageUrl("");
    setIsCheckCompleted(false);
    setSimilarIp([]);
  };

  console.log({ similarIp });

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Check Image</h1>

        <div className="w-full max-w-md space-y-4">
          {!imageUrl && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Or enter image URL"
              className="flex-1 p-2 border rounded text-black"
            />
          </div>
        </div>

        {imageData && (
          <div className="w-full max-w-md">
            <img src={imageData} alt="Preview" className="w-full rounded" />
          </div>
        )}

        {!isCheckCompleted && (
          <button
            onClick={handleCheck}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Check Image
          </button>
        )}

        {isCheckCompleted && (
          <>
            {similarIp.length > 0 && <SimilarIpList similarIp={similarIp} />}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleTryAnother}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
              >
                Try Another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
