import { Download, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import React from "react";

type EditModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (e: FormData) => void;
  description: string;
  path:string;
};

const CSVModel = ({
  isOpen,
  onClose,
  title,
  isLoading,
  onSubmit,
  description,
  path
}: EditModalProps) => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      onSubmit(formData);
    }
  };

  const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href = path;
  link.download = "template.csv";
  link.click();
};

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
        {`Import ${title} from CSV`}
      </div>
      <div className="p-4">
        <h3 className="mb-4 text-stone-700">{description}</h3>
        <div className="mt-2 flex items-center gap-2">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="flex-1"
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
      </div>
      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          variant="ghost"
          type="button"
          className="text-black"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
          <Save size={16} />
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default CSVModel;
