// src/pages/upload.tsx
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Header from "../components/Header";
import UploadForm from "../components/UploadForm";

export default function Home() {
  const router = useRouter();

  const handleSuccess = (ipId: string, nftMetadataURI: string) => {
    // Store the IPFS URL in local storage
    localStorage.setItem(ipId, nftMetadataURI);
    router.push(`/upload_success/${ipId}`);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Upload Image & Add Data</h1>
        <UploadForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
