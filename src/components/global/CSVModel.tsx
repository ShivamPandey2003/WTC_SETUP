import { Download, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import React, { useEffect } from "react";
import { useUploadBulkNews } from "@/api/home_design_api/Home_design_api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setResponseData, setResponseModal } from "@/redux/ModalSlice";
// import { unzipWithWorker } from "@/workers/unzip.worker";
// import { getPresignedUrls } from "@/services/upload.service";
import { apiRequest } from "@/services/apiService";
import axios from "axios";
import { generateExhibitorId } from "@/lib/utils";

type EditModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (e: FormData) => void;
  description: string;
  path: string;
  ImageDescription?: string;
  type: number | { ATTACHMENT: number; IMAGE: number };
};

const CSVModel = ({
  isOpen,
  onClose,
  title,
  isLoading,
  onSubmit,
  description,
  path,
  ImageDescription,
  type,
}: EditModalProps) => {
  const [file, setFile] = React.useState<
    | {
        file_path: string;
        filename: string;
      }
    | File
    | null
  >(null);
  const [Type, setType] = React.useState<"CSV" | "IMAGE" | "ATTACHMENT">("CSV");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  // const { UploadBulkImages, isPending, data } = useUploadNewsImages();
  const { UploadBulk, isBulkPending, BulkData } = useUploadBulkNews();
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (Type === "CSV") {
        setFile(e.target.files[0]);
        return;
      }
      // handleZipUpload(e.target.files[0]);
      const old = e.target.files[0];
      const filename = generateExhibitorId() + ".zip";
      const file = new File([old], filename, {
        type: old.type,
      });
      try {
        setIsUploading(true);
        const res = await apiRequest(
          "post",
          `/upload/presigned-url?file_name=${file.name}&module=${"app_zip"}`,
        );
        const { file_key, file_name, upload_url } = res.response.response;

        await axios.put(upload_url, file, {
          headers: {
            "Content-Type": "application/x-zip-compressed",
          },
          responseType: "blob",
        });
        setFile({ file_path: file_key, filename: file_name });
      } catch (error) {
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (file === null) return;
    if (Type === "CSV" && file instanceof File) {
      const formData = new FormData();
      formData.append("file", file);
      onSubmit(formData);
    } else if (
      Type === "IMAGE" &&
      Object.keys(type).length > 0 &&
      typeof file === "object" &&
      "file_path" in file &&
      file.filename !== ""
    ) {
      UploadBulk({
        type: type[Type as keyof typeof type],
        ...file,
      });
    } else if (
      Type === "ATTACHMENT" &&
      Object.keys(type).length > 0 &&
      typeof file === "object" &&
      "file_path" in file &&
      file.filename !== ""
    ) {
      UploadBulk({
        type: type[Type as keyof typeof type],
        ...file,
      });
    } else if (
      typeof type === "number" &&
      // Object.keys(type).length > 0 &&
      typeof file === "object" &&
      "file_path" in file &&
      file.filename !== ""
    ) {
      UploadBulk({ type: type, ...file });
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = path;
    link.download = "template.csv";
    link.click();
  };

  useEffect(() => {
    if (!BulkData) return;
    if (BulkData.response.failed.length) {
      dispatch(setResponseData(BulkData.response.failed));
      dispatch(setResponseModal(true));
    }
    setType("CSV");
    onClose();
  }, [BulkData]);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      closeOnOverlayClick={false}
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {`Upload ${title}`}
      </div>
      <div className="p-4">
        <h3 className="mb-4 text-stone-700">
          {Type === "CSV" ? description : ImageDescription}
        </h3>
        <div className="mb-2">
          <select
            className="w-full border border-gray-400 outline-0 p-1.5 rounded-md"
            value={Type}
            onChange={(e) => setType(e.target.value as "CSV" | "IMAGE")}
          >
            <option value="CSV">{"Upload Entries (CSV)"}</option>
            <option value="IMAGE">{"Upload Images (ZIP)"}</option>
            {Object.keys(type).length > 0 && (
              <option value="ATTACHMENT">{"Upload Attachments (ZIP)"}</option>
            )}
          </select>
        </div>
        {Type === "CSV" ? (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isBulkPending || isLoading}
              className="flex-1 border border-gray-400 outline-0 ring-0"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="flex items-center gap-2 hover:text-white border-gray-400"
            >
              <Download className="h-4 w-4" />
              Template
            </Button>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="flex-1"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          variant="ghost"
          type="button"
          className="text-black"
          onClick={onClose}
          disabled={isLoading || isBulkPending || isUploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || isBulkPending || isUploading || file === null}
          onClick={handleSubmit}
        >
          <Save size={16} />
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default CSVModel;
