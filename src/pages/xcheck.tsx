// src/pages/xcheck.tsx
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { IPayload } from "@/types/IPayload";
import SimilarIpList from "../components/SimilarIpList";
import CheckIp from "../components/CheckIp";

export default function XCheck() {
  const [url, setUrl] = useState(
    "https://x.com/Eason_C13/status/1886270288284770646"
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [similarIp, setSimilarIp] = useState<IPayload[]>([]);
  const [isCheckCompleted, setIsCheckCompleted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("pid");
    if (pid) {
      setUrl(pid);
    }
  }, []);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tweetId = url.startsWith("https://")
        ? url.split("/status/")[1]?.split("?")[0]
        : url;
      const response = await fetch(
        `/api/x/fetchPost?url=${encodeURIComponent(tweetId)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      }
      const data = await response.json();
      toast.success("Post data fetched successfully");
      setImageUrl(data.image);
      setIsSubmitted(true);
      await handleCheckIP(data.image);
    } catch (error) {
      console.error("Error fetching URL data:", error);
      toast.error("Failed to fetch post data");
    }
  };

  const handleCheckIP = async (imageUrl_: string = imageUrl!) => {
    try {
      // Fetch the image and convert to base64
      const imageResponse = await fetch(imageUrl_!);
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
      console.log("IP Check Result:", data);
      for (let i = 0; i < data.results.length; i++) {
        console.log(data.results[i]);
        if (data.results[i].score > 0.8) {
          setSimilarIp((prev) => [
            ...prev,
            {
              ...(data.results[i].payload as IPayload),
              score: data.results[i].score,
            },
          ]);
        }
      }

      toast.info("IP check completed");
    } catch (error) {
      console.error("Error checking IP:", error);
      toast.error("Failed to check IP");
    }
  };

  const handleTryAnother = () => {
    setImageUrl(null);
    setIsSubmitted(false);
    setUrl("");
    setIsCheckCompleted(false);
  };

  const handleSimilarIpFound = (foundIps: IPayload[]) => {
    setSimilarIp(foundIps);
    setIsCheckCompleted(true);
  };

  console.log({ similarIp });

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Storylock</h1>
        <h2 className="text-2xl font-bold">Check Post IP with URL</h2>

        {!isSubmitted ? (
          <form onSubmit={handleUrlSubmit} className="w-full max-w-md">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter X (Twitter) Post URL"
                className="p-2 border rounded text-black"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit URL
              </button>
            </div>
          </form>
        ) : (
          <>
            {imageUrl && (
              <div className="w-full max-w-md">
                <img
                  src={imageUrl}
                  alt="Post"
                  className="w-full rounded shadow-lg"
                />
                {/* {!isCheckCompleted && (
                  <CheckIp
                    imageUrl={imageUrl}
                    onSimilarIpFound={handleSimilarIpFound}
                  />
                )} */}
                {similarIp.length > 0 && (
                  <SimilarIpList similarIp={similarIp} />
                )}
              </div>
            )}
          </>
        )}

        {isSubmitted && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleTryAnother}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Try Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
