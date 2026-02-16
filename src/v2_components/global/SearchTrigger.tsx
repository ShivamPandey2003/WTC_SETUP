import { Search } from 'lucide-react';
import { useEffect } from 'react';

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all hover:shadow-md hover:border-gray-400"
    >
      <Search className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
        Search...
      </span>
      <kbd className="hidden sm:inline-flex ml-auto px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
        ⌘K
      </kbd>
    </button>
  );
}