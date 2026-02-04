import Modal from "@/components/ui/Modal";
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
    const Exhibitor = data.find(pre=>pre.id === id)
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
      classname="overflow-y-auto"
    >
        {
            Exhibitor?
            <div>
                
            </div>:<div>No such data found</div>
        }
    </Modal>
  );
};

export default ExhibitorModal;
