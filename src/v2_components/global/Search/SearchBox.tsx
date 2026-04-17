import { Search, X } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/services/apiService";
import type { AxiosError } from "axios";
import { useDebounce } from "@/hooks/useDebounce";
// import type { SearchResult } from "./type";

interface Props {
  handleSelect: React.Dispatch<
    React.SetStateAction<{
      id: string;
      date: string;
    } | null>
  >;
}

export function SearchBox({handleSelect}:Props) {
  const [input, setInput] = React.useState<string>("");
  const debouncedSearch = useDebounce(input, 500);

  const { data } = useQuery<
    any,
    AxiosError
  >({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      const res = await apiRequest("get", `program/filter?search=${input}`);
      return res.response;
    },
    enabled: !!debouncedSearch,
    retry: false,
    staleTime: 1000 * 60 * 2,
  });


  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          className="flex-1 text-sm outline-none bg-transparent"
          autoComplete="off"
        />
        {input.trim() && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <SearchDropdown
        results={data?.response ?? []}
        isOpen={true}
        onSelect={(e)=>handleSelect({id:e.id, date:""})}
      />
    </div>
  );
}
