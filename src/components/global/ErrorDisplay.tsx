import { AlertCircle, AlertTriangle, X } from 'lucide-react';

type ErrorType = 'error' | 'warning' | 'info';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  type?: ErrorType;
  onDismiss?: () => void;
}

const ErrorDisplay = ({
  title,
  message,
  type = 'error',
  onDismiss
}: ErrorDisplayProps) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200',
          icon: 'text-amber-600',
          title: 'text-amber-900',
          message: 'text-amber-800',
          Icon: AlertTriangle
        };
      case 'info':
        return {
          container: 'bg-teal-50 border-teal-200',
          icon: 'text-teal-600',
          title: 'text-teal-900',
          message: 'text-teal-800',
          Icon: AlertCircle
        };
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-800',
          Icon: AlertTriangle
        };
    }
  };

  const styles = getStyles();
  const IconComponent = styles.Icon;

  return (
    <div className={`${styles.container} border rounded-lg p-4 flex gap-3 relative min-w-sm`}>
      <div className="shrink-0">
        <IconComponent className={`${styles.icon} w-5 h-5`} />
      </div>
      <div className="flex-1">
        {title && (
          <h3 className={`${styles.title} font-semibold text-sm mb-1`}>
            {title}
          </h3>
        )}
        <p className={`${styles.message} text-sm leading-relaxed`}>
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`shrink-0 hover:opacity-70 transition-opacity absolute top-2 right-2`}
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
