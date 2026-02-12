import Modal from '@/components/ui/Modal';
import EditFrom from './EditForm';

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
      closeOnOverlayClick={false}
      classname="p-0"
    >
      <div className="bg-primary w-full rounded-t-lg px-6 text-white py-3 text-xl font-[600]">
        {"Edit Speaker"}
      </div>
      <div className="">
        <div>
          <EditFrom />
        </div>
      </div>
    </Modal>
  )
}

export default EditModal