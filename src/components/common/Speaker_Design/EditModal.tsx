import Modal from '@/components/ui/Modal';
import NewFrom from './NewFrom';

type EditModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const EditModal:React.FC<EditModalProps> = ({isOpen, onClose}) => {
  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {"Edit Speaker"}
      </div>
      <div className="p-6">
        <div>
          <NewFrom />
        </div>
      </div>
    </Modal>
  )
}

export default EditModal