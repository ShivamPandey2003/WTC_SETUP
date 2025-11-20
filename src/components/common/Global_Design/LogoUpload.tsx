import { useUploadLogo } from "@/api/global_api/global_api";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface LogoUploadProps {
  logoUrl: string;
  fileName?: string;
}

export default function LogoUpload({
  logoUrl,
  fileName = "ita-montreal.png",
}: LogoUploadProps) {
  const [image, setImage] = React.useState<string | null>(logoUrl);
  const { UploadLogo, isPending } = useUploadLogo();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newForm = new FormData();
    const file = e.target.files?.[0];
    if (file) {
      newForm.append("file", file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      UploadLogo(newForm);
    }
  };

  const handleRemoveImage = () => setImage(null);

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">App Logo</h3>
      <div className="bg-white p-4 rounded border border-gray-200 inline-block">
        {isPending ? (
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
          <label className="cursor-pointer hover:underline">
            Change
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
              className="hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
