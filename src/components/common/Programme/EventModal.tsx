import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Events from "@/data/Events";
import { FileText, X } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string;
};

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const Event = Events.find((pre) => pre.title === id);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
    >
      <div className="w-full">
        {/* Header Image */}
        <div className="flex items-start gap-4">
          <img
            src={Event?.image}
            alt={Event?.time}
            className="w-[200px] h-[118px] rounded-[8px] object-cover opacity-80"
          />
          <div className="">
            <h2 className="text-xl font-[700] text-primary mb-2">
              {Event?.title}
            </h2>
            <p className="text-sm text-primary font-[600] mb-1">
              {Event?.time}
            </p>
            <Button variant={"link"} size={"sm"} className="p-0">
              {Event?.location}
            </Button>
            <button
              onClick={() => onClose(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-700 font-[600]" />
            </button>
            <div className="flex gap-3 mb-5">
              <Button variant={"link"} size={"sm"} className="p-0">
                Add to calendar
              </Button>
              <Button variant={"link"} size={"sm"} className="p-0">
                Notify me
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {Event?.description}
          </p>

          <div className="flex items-center gap-2 mb-5 text-sm text-gray-700">
            <FileText className="w-4 h-4" />
            <span className="hover:underline cursor-pointer">Paper.pdf</span>
          </div>

          <div className="flex items-center gap-6">
            {Event?.speakers.split("&").map((speaker, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-2 overflow-hidden">
                  {!speaker ? (
                    <img
                      src={speaker}
                      alt={speaker}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-gray-700 text-center">
                  {speaker}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;
