import Modal from "@/components/ui/Modal";
import type { RootState } from "@/redux/store";
import { X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string;
};

const DetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const { News } = useSelector((state: RootState) => state.ExtraSlice);
  const data = News.find((p) => p.id === id);
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
      closeOnOverlayClick={false}
      classname="overflow-y-auto p-0 relative"
    >
      {data ? (
        <>
          <img
            src={
              data.bg_img
                ? data.bg_img
                : "https://images.pexels.com/photos/4940642/pexels-photo-4940642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            alt=""
            className="w-full h-[15rem] object-cover rounded-t-lg bg-gray-200"
          />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p>{data.description}</p>
          </div>
          <X
            onClick={() => onClose(null)}
            className="text-white absolute top-2 right-2 cursor-pointer"
          />
        </>
      ) : (
        <div className="relative p-4">
          No such data found
          <X
            onClick={() => onClose(null)}
            className="text-white absolute top-2 right-2 cursor-pointer"
          />
        </div>
      )}
    </Modal>
  );
};

export default DetailsModal;
