import Modal from "@/components/ui/Modal";
import { X } from "lucide-react";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | string[];
  data: (CreateSpeakerRequest & {
    speaker_id: string;
  })[];
};

const SpeakerModal: React.FC<ModalProps> = ({ isOpen, onClose, id, data }) => {
  const Speaker = data.find((pre) => pre.speaker_id === id);
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
      classname="overflow-y-auto"
    >
      {Speaker ? (
        <div className="relative">
          <div className="flex gap-4">
            <img
              src={
                Speaker.user_img
                  ? Speaker.user_img
                  : "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={Speaker.name}
              className="w-[10rem] h-[15rem] rounded-lg object-cover"
            />
            <div>
                <h2 className="text-3xl font-bold mb-2">{Speaker.name}</h2>
                <p className="text-lg font-semibold mb-4">{Speaker.bio}</p>
                <p><span className="font-medium">Session:</span> {Speaker.total_sessions}</p>
                {Speaker.coming_sessions.length > 0 && <p><span className="font-medium">Coming sessions:</span> {Speaker.coming_sessions.length}</p>}
            </div>
          </div>
          <X onClick={()=>onClose(null)} className="absolute top-0 right-0"/>
        </div>
      ) : (
        <div>No such data found</div>
      )}
    </Modal>
  );
};

export default SpeakerModal;
