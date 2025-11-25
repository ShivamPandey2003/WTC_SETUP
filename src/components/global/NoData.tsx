import { Database } from 'lucide-react';

interface NoDataProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NoData = ({
  title = 'No data available',
  message = 'There\'s nothing to display here yet.',
  action
}: NoDataProps) => {
  return (
    <div className="flex flex-col max-w-sm items-center justify-center py-12 px-4 rounded-lg">
      <div className="mb-4 p-3 bg-bgCard rounded-full">
        <Database className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-slate-600 text-sm text-center max-w-sm mb-6">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default NoData;
