import { type SearchResult } from './type';

interface Props {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

export function ResultItem({ result, onSelect }: Props) {
  return (
    <button
      type="button"
      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
      onClick={() => onSelect(result)}
    >
      {result.title}
    </button>
  );
}