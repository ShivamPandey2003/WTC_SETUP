import Modal from "@/components/ui/Modal";
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | string[];
  data: Exhibitor[];
};

const ExhibitorModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  id,
  data,
}) => {
  const Exhibitor = data.find((pre) => pre.id === id);
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="md"
      showCloseButton
      classname="overflow-y-auto p-0 rounded-xl"
    >
      {Exhibitor ? (
        <div className="relative">
          <div
            className={`bg-gray-300 p-8 flex items-center justify-center min-h-32`}
          >
            <img
              src={Exhibitor.logo}
              alt={Exhibitor.full_name}
              className="h-12 object-contain"
            />
          </div>
          <div className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {Exhibitor.full_name}
            </h3>
            <div className="flex gap-2">
              <span className=" capitalize">mail:-</span>
              <span className="">{Exhibitor.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Booth Hall C · Booth 21</p>

              {Exhibitor.url && (
                <a
                  href={Exhibitor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
          <X onClick={()=>onClose(null)} className="absolute top-2 right-2"/>
        </div>
      ) : (
        <div>No such data found</div>
      )}
    </Modal>
  );
};

export default ExhibitorModal;
