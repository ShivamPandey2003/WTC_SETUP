import { Download, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import React, { useEffect } from "react";
import { useUploadNewsImages } from "@/api/home_design_api/Home_design_api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setResponseData, setResponseModal } from "@/redux/ModalSlice";

type EditModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (e: FormData) => void;
  description: string;
  path: string;
  ImageDescription?: string;
  type: number | number[];
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
  const [file, setFile] = React.useState<File | null>(null);
  const [Type, setType] = React.useState<"CSV" | "IMAGE">("CSV");
  const { UploadBulkImages, isPending, data } = useUploadNewsImages();
  const [selectedType, setSelectedType] = React.useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      if (Type === "CSV") {
        onSubmit(formData);
      }else if(Array.isArray(type)){
        UploadBulkImages({ type: selectedType, form: formData });
      } else {
        UploadBulkImages({ type: type, form: formData });
      }
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = path;
    link.download = "template.csv";
    link.click();
  };

  useEffect(()=>{
    if(Array.isArray(type)){
      setSelectedType(type[0])
    }
  },[type, setSelectedType])

  useEffect(() => {
    if (!data) return;

    if (data.response.length) {
      dispatch(setResponseData(data.response));
      dispatch(setResponseModal(true));
      setType("CSV");
      onClose();
    }
  }, [data]);

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
            <option value="CSV">CSV</option>
            <option value="IMAGE">IMAGES</option>
          </select>
        </div>
        {Array.isArray(type) && Type === "IMAGE" && (
          <div>
            <select
              className="w-full border border-gray-400 outline-0 p-1.5 rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(Number(e.target.value))}
            >
              <option value={type[0]}>Attachment</option>
              <option value={type[1]}>Images</option>
            </select>
          </div>
        )}
        {Type === "CSV" ? (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isPending || isLoading}
              className="flex-1 border border-gray-400 outline-0 ring-0"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="flex items-center gap-2 hover:text-white"
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
          disabled={isLoading || isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || isPending}
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
