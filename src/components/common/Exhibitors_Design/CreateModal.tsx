import Modal from '@/components/ui/Modal';
import NewFrom from './NewFrom';

type CreateModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const CreateModal:React.FC<CreateModalProps> = ({isOpen, onClose}) => {
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-6 text-white py-3 text-xl font-semibold">
        {"Add New Exhibitor for WTC 2026"}
      </div>
      <div className="p-6">
        <div>
          <NewFrom />
        </div>
      </div>
    </Modal>
  )
}

export default CreateModal