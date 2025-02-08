// src/pages/upload_success/[ipId].tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

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
      {<Confetti recycle={false} />}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Upload Successful!</h1>
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

      <div className="flex flex-col gap-4 w-full max-w-md">
        <a
          href={`https://explorer.story.foundation/ipa/${ipId}`}
          target="_blank"
          className="w-full p-3 text-white bg-green-500 rounded-lg hover:bg-green-600 text-center transition-colors duration-200"
        >
          View at Story Explorer
        </a>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/xupload")}
            className="flex-1 p-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Upload Another
          </button>
          <button
            onClick={() => router.push("/xcheck")}
            className="flex-1 p-3 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Check IP
          </button>
        </div>
      </div>
    </div>
  );
}
