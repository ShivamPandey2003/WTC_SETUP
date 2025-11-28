// import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
// import dummy from "@/assets/Images/Dummy.png";
// import type { RootState } from "@/redux/store";
// import { FileText, X } from "lucide-react";
import React from "react";
// import { useSelector } from "react-redux";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string;
};

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // const { Session } = useSelector((state: RootState) => state.Global_Slice);

  // const selectedValue = Session.find((pre) => pre.id === id);

  // console.log(selectedValue);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
    >
      <div></div>
      {/* {!selectedValue ? (
        <div>No such data found</div>
      ) : (
        <div className="w-full">
          <div className="flex items-start gap-4">
            <img
              src={selectedValue.bg_img?`data:image/png;base64,${selectedValue.bg_img}`:dummy}
              alt={selectedValue.title}
              className="w-[200px] h-[118px] rounded-lg object-cover opacity-80"
            />
            <div className="">
              <h2 className="text-xl font-bold text-primary mb-2">
                {selectedValue.title}
              </h2>
              <p className="text-sm text-primary font-semibold mb-1">
                {`${selectedValue.start_date} - ${selectedValue.end_date}`}
              </p>
              <Button variant={"link"} size={"sm"} className="p-0">
                {selectedValue.location}
              </Button>
              <button
                onClick={() => onClose(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-700 font-semibold" />
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
          <div className="relative">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {selectedValue.description}
            </p>

            <div className="flex items-center gap-2 mb-5 text-sm text-gray-700">
              <FileText className="w-4 h-4" />
              <span className="hover:underline cursor-pointer">Paper.pdf</span>
            </div>

            <div className="flex items-center gap-6">
              {selectedValue.speakers.map((speaker, index) => (
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
                  {speaker.fullname}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>
      )} */}
    </Modal>
  );
};

export default EventModal;
