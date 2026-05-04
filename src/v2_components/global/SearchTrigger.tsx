import { Search } from 'lucide-react';
import { useEffect } from 'react';

interface SearchTriggerProps {
  onClick: () => void;
  tabname: string;

}

export function SearchTrigger({ onClick, tabname }: SearchTriggerProps) {
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
      className="group flex items-center gap-3 px-2 sm:px-4 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all hover:shadow-md hover:border-gray-400 sm:w-[200px] cursor-pointer"
    >
      <Search className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      <span className="hidden sm:block text-gray-500 group-hover:text-gray-700 transition-colors">
        Search {tabname ? tabname : "..."}
      </span>
    </button>
  );
}