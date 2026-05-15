import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SingleSelectOption {
  label: string;
  value: string;
  start_time?: string;
  end_time?: string;
}

interface SingleSelectProps {
  options: SingleSelectOption[];
  selected: string | null;
  onChange: (selected: string | null) => void;
  placeholder?: string;
  className?: string;
  capitalize?: boolean;
  Url?: boolean;
}

const SingleSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select session",
  className,
  capitalize = false,
  Url = false,
}: SingleSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  const selectedOption = options.find((o) => o.value === selected) ?? null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && selectedRef.current && listRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  const select = (value: string) => {
    onChange(selected === value ? null : value);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={cn(`relative w-[30vw]`, className)}>
      <div
        className="flex min-h-[20px] cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:border-gray-400 focus-within:ring-0"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {open ? (
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            placeholder={placeholder}
            className="min-w-[60px] flex-1 border-none bg-transparent text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-400"
          />
        ) : (
          <span
            className={cn(
              "flex-1 truncate text-sm",
              selectedOption ? "text-primary font-medium" : "text-gray-400",
              capitalize && "capitalize",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}
        {open ? (
          <X
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setSearch("");
            }}
            size={16}
            className="ml-auto shrink-0 text-gray-400"
          />
        ) : (
          <ChevronDown size={16} className="ml-auto shrink-0 text-gray-400" />
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          className={cn(
            "absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
            capitalize && "capitalize",
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">
              No results found
            </li>
          ) : (
            filtered.map((o) => {
              const isSelected = selected === o.value;
              return (
                <li
                  key={o.value}
                  ref={isSelected ? selectedRef : null}
                  onClick={() => select(o.value)}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                    isSelected ? "text-primary font-medium" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && <Check size={10} />}
                  </span>
                  <span className={cn("flex flex-col", Url && "w-full")}>
                    {o.start_time && o.end_time && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs opacity-60">
                          {o.start_time} - {o.end_time}
                        </span>
                        {Url && (
                          <span className="text-primary text-xs font-semibold underline capitalize underline-offset-2 cursor-pointer">
                            view
                          </span>
                        )}
                      </div>
                    )}
                    {o.label}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default SingleSelect;
