import Modal from '@/components/ui/Modal';
import NewFrom from './NewFrom';

type EditModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const CreateModal:React.FC<EditModalProps> = ({isOpen, onClose}) => {
  return (
    <Modal
      showHeader={true}
      title='Create News'
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      classname="p-0"
      closeOnOverlayClick={false}
    >
      {/* <div className="bg-primary w-full rounded-t-lg px-6 text-white py-3 text-xl font-[600]">
        {"Create News"}
      </div> */}
      <div className="">
        <div>
          <NewFrom />
        </div>
      </div>
    </Modal>
  )
}

export default CreateModal