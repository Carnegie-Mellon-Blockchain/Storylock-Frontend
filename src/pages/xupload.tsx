// src/pages/xupload.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import UploadForm, { FormData } from "../components/UploadForm";
import { toast } from "react-toastify";

export default function XUpload() {
  const router = useRouter();
  const [url, setUrl] = useState(
    "https://x.com/Eason_C13/status/1886270288284770646"
  );
  const [formData, setFormData] = useState<FormData | null>(null);

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
      setFormData(data);
    } catch (error) {
      console.error("Error fetching URL data:", error);
    }
  };

  const handleSuccess = (ipId: string, nftMetadataURI: string) => {
    localStorage.setItem(ipId, nftMetadataURI);
    router.push(`/upload_success/${ipId}`);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Storylock</h1>
        <h2 className="text-2xl font-bold"> Register Post IP with URL</h2>

        {!formData && (
          <>
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
          </>
        )}

        {formData && (
          <UploadForm onSuccess={handleSuccess} defaultValues={formData} />
        )}
      </div>
    </div>
  );
}
