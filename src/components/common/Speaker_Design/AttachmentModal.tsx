import Modal from "@/components/ui/Modal";
import { isValidImage } from "@/lib/utils";
import { Link, X } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    filename: string;
    speaker_image: string;
  }[];
};

const AttachmentModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      classname="p-0 relative"
    >
      <div className="bg-primary w-full rounded-t-lg px-6 text-white py-3 text-xl font-[600]">
        {"Attachments"}
      </div>
      <div className="max-h-[70vh] overflow-y-auto p-6 custom-scrollbar">
        {data.map((pre, i) =>
          isValidImage(pre.filename) ? (
            <div key={i} className="flex items-start gap-8 mb-6">
              <div>{i + 1}.</div>
              <img
                src={pre.speaker_image}
                alt={pre.filename}
                className="w-4/5 h-[25rem]"
              />
            </div>
          ) : (
            <div key={i} className="flex items-start gap-8 mb-6">
              <div>{i + 1}.</div>
              <a
                href={pre.speaker_image}
                target="_blank"
                className="flex items-center text-blue-600 gap-1"
              >
                <Link size={18} /> Click to check
              </a>
            </div>
          ),
        )}
      </div>
      <X onClick={onClose} className=" absolute top-4 right-4 text-white"/>
    </Modal>
  );
};

export default AttachmentModal;
