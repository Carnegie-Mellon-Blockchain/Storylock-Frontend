// src/components/UploadForm.tsx
import { useState } from "react";
import { toast } from "react-toastify";

export interface FormData {
  title: string;
  description: string;
  image: string;
  type: string;
  author: string;
  timestamp: string;
  permanentUrl: string;
}

interface UploadFormProps {
  defaultValues?: Partial<FormData>;
  onSuccess: (ipId: string, nftMetadataURI: string) => void;
}

export default function UploadForm({
  defaultValues = {},
  onSuccess,
}: UploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: defaultValues.title || "",
    description: defaultValues.description || "",
    image: defaultValues.image || "",
    type: defaultValues.type || "",
    author: defaultValues.author || "",
    timestamp: defaultValues.timestamp || "",
    permanentUrl: defaultValues.permanentUrl || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      toast.error("Please provide an image URL");
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const response = await fetch("/api/ip/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: formData.image,
          metadata: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register IP");
      }

      const data = await response.json();
      toast.success("Successfully registered IP!");
      console.log("Registration response:", data);

      onSuccess(data.ipId, data.nftMetadataURI);
    } catch (error) {
      toast.error("Failed to register IP");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {formData.image && (
        <div className="w-full">
          <img src={formData.image} alt="Preview" className="w-full rounded" />
        </div>
      )}

      <input
        type="url"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        name="timestamp"
        placeholder="Timestamp"
        value={formData.timestamp}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />
      <input
        type="text"
        name="permanentUrl"
        placeholder="Permanent URL"
        value={formData.permanentUrl}
        onChange={handleInputChange}
        className="w-full p-2 border rounded text-black"
      />

      <button
        onClick={handleSubmit}
        className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Register IP
      </button>
    </div>
  );
}
