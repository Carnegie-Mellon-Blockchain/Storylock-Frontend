// src/pages/upload_success/[ipId].tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function UploadSuccess() {
  const router = useRouter();
  const { ipId } = router.query;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (ipId) {
      // Get the IPFS URL from localStorage
      const nftMetadataURI = localStorage.getItem(ipId as string);
      if (nftMetadataURI) {
        // Fetch the metadata and extract image URL
        fetch(nftMetadataURI)
          .then((res) => res.json())
          .then((metadata) => {
            setImageUrl(metadata.image);
          })
          .catch((err) => {
            console.error("Error fetching metadata:", err);
          });
      }
    }
  }, [ipId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Upload Successful! 🎉</h1>
        <p className="text-xl mb-8">Your IP ID is: {ipId}</p>
      </div>

      {imageUrl && (
        <div className="mb-8">
          <img
            src={imageUrl}
            alt="Uploaded IP"
            className="max-w-md rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href={`https://explorer.story.foundation/ipa/${ipId}`}
          className="p-3 text-white bg-green-500 rounded-lg hover:bg-green-600 text-center transition-colors duration-200"
        >
          View at Story Explorer
        </a>
        <button
          onClick={() => router.push("/xupload")}
          className="p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Upload Another
        </button>
      </div>
    </div>
  );
}
