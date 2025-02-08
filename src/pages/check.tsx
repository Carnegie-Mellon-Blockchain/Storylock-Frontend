// src/pages/check.tsx
import { useState } from "react";
import { toast } from "react-toastify";

import Header from "../components/Header";

export default function Check() {
  const [imageData, setImageData] = useState<string | null>(null);

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

  const handleCheck = () => {
    if (!imageData) {
      toast.error("Please upload an image first");
      return;
    }
    // TODO: Add check logic here
    console.log("Checking image:", imageData);
  };

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Check Image</h1>

        <div className="w-full max-w-md">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
        </div>
        {imageData && (
          <div className="w-full max-w-md">
            <img src={imageData} alt="Uploaded" className="w-full rounded" />
          </div>
        )}

        <button
          onClick={handleCheck}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Check Image
        </button>
      </div>
    </div>
  );
}
