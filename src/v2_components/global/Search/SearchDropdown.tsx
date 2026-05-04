import { type SearchResult } from './type';
import { ResultItem } from './ResultItem';

interface Props {
  results: SearchResult[];
  isOpen: boolean;
  onSelect: (result: SearchResult) => void;
}

export function SearchDropdown({ results, isOpen, onSelect }: Props) {
  if (!isOpen || results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999]">
      {results.map((result) => (
        <ResultItem key={result.id} result={result} onSelect={onSelect} />
      ))}
    </div>
  );
}
