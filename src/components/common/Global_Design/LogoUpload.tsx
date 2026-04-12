import { useUploadLogo } from "@/api/global_api/global_api";
import { apiRequest } from "@/services/apiService";
import axios from "axios";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface LogoUploadProps {
  logoUrl: string;
  fileName?: string;
  type?: number;
  title?: string;
  recommend?: string;
  module?: string;
}

export default function LogoUpload({
  logoUrl,
  fileName = "ita-montreal.png",
  type = 1,
  title = "App Logo",
  recommend = "128 × 68",
  module = "app_logo",
}: LogoUploadProps) {
  const [image, setImage] = React.useState<string | null>(logoUrl);
  const { UploadLogo, isPending } = useUploadLogo();
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const res = await apiRequest(
        "post",
        `/upload/presigned-url?file_name=${file.name}&module=${module}`,
      );

      const { file_key, upload_url } = res.response.response;
      await axios.put(upload_url, file, {
        headers: {
          "Content-Type": file.type,
        },
        responseType: "blob",
      });

      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      UploadLogo({ data: { file_path: file_key }, type });
      setLoading(false);
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="bg-white p-4 rounded border border-gray-200 inline-block w-[180px]">
        {(isPending || loading) ? (
          <div className="flex items-center justify-center">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        ) : (
          <img
            src={image as string}
            alt="App Logo"
            className="h-16 object-contain"
          />
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-gray-600">{fileName}</span>
        <div className="flex space-x-3 text-sm">
          <label className="cursor-pointer hover:underline hover:text-blue-600">
            <Pencil size={15}/>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="hover:underline cursor-pointer hover:text-red-500"
            >
              <Trash2 size={15}/>
            </button>
          )}
        </div>
      </div>
      <div className="my-3 text-xs flex flex-col items-start">
        <span>PNG</span>
        <span>Max 2MB</span>
        <span>Recommended {recommend}</span>
      </div>
    </div>
  );
}
