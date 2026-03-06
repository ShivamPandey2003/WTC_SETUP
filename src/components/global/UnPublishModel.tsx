import Modal from '@/components/ui/Modal';
import { Earth } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isAction?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function UnPublishModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Unpublish',
  message,
  itemName,
  isAction = false,
  confirmText = 'Unpublish',
  cancelText = 'Cancel',
}: UploadModalProps) {
  const defaultMessage = itemName
    ? `Are you sure you want to Unpublish "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to Unpublish this item? This action cannot be undone.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showHeader={false}
      closeOnOverlayClick={false}
      closeOnEscape={!isAction}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Earth className="w-6 h-6 text-gray-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-600 mb-6">
          {message || defaultMessage}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isAction}
            className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isAction}
            className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isAction ? 'Publishing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
