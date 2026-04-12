import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  //   const selectedOptions = options.filter((o) => selected.includes(o.value));

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

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  //   const remove = (value: string, e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     onChange(selected.filter((v) => v !== value));
  //   };

  return (
    <div ref={containerRef} className="relative w-[30vw]">
      <div
        className="flex min-h-[20px] cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 transition-colors hover:border-foreground/30 focus-within:ring-0 focus-within:ring-ring"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* {open &&
          selectedOptions.map((o) => (
            <span
              key={o.value}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
            >
              {o.label}
              <button
                onClick={(e) => remove(o.value, e)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X size={12} />
              </button>
            </span>
          ))} */}
        {open ? (
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            placeholder={placeholder}
            className="min-w-[60px] flex-1 border-none bg-transparent text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
          />
        ) : (
          <span className="flex-1 text-sm text-muted-foreground truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} selected`}
          </span>
        )}
        <ChevronDown
          onClick={(e) => {
            e.stopPropagation()
            setOpen(false);
          }}
          size={16}
          className={`ml-auto shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <ul className="absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No results found
            </li>
          ) : (
            filtered.map((o) => {
              const isSelected = selected.includes(o.value);
              return (
                <li
                  key={o.value}
                  onClick={() => toggle(o.value)}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                    isSelected
                      ? "text-foreground font-medium"
                      : "text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </span>
                  {o.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
