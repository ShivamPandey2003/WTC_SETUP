interface ModalFooterProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'between';
}

const alignmentClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
};

export default function ModalFooter({ children, alignment = 'right' }: ModalFooterProps) {
  return (
    <div className={`flex ${alignmentClasses[alignment]} gap-3 pt-4 border-t border-gray-200 mt-6`}>
      {children}
    </div>
  );
}
