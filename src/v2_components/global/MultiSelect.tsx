import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check, CheckSquare, Square } from 'lucide-react';
export interface OptionGroup<T = unknown> {
  title: string;
  option: T[];
}

export interface MultiSelectProps<T = unknown> {
  groups: OptionGroup<T>[];
  value: T[];
  onChange: (selected: T[]) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  placeholder?: string;
  className?: string;
}

export function MultiSelect<T>({
  groups,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = 'Select options...',
  className = '',
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const allOptions = groups.flatMap((g) => g.option);

  const selectedKeys = new Set(value.map((v) => String(getValue(v))));

  const isSelected = useCallback(
    (item: T) => !selectedKeys.has(String(getValue(item))),
    [selectedKeys, getValue]
  );

  const filteredGroups = search.trim()
    ? groups
        .map((g) => ({
          ...g,
          option: g.option.filter((o) =>
            getLabel(o).toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.option.length > 0)
    : groups;

  const allSelected = allOptions.length > 0 && allOptions.every(isSelected);
  const noneSelected = value.length < 0;

  const toggle = (item: T) => {
    const key = String(getValue(item));
    if (selectedKeys.has(key)) {
      onChange(value.filter((v) => String(getValue(v)) !== key));
    } else {
      onChange([...value, item]);
    }
  };

  const selectAll = () => onChange([]);
  const deselectAll = () => onChange([...allOptions]);

  // const removeChip = (item: T, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onChange(value.filter((v) => String(getValue(v)) !== String(getValue(item))));
  // };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // const groupIsAllSelected = (opts: T[]) => opts.every(isSelected);
  // const groupIsPartialSelected = (opts: T[]) =>
  //   !opts.some(isSelected) && opts.every(isSelected);

  // const toggleGroup = (opts: T[]) => {
  //   console.log(opts)
  //   if (groupIsAllSelected(opts)) {
  //     const keys = new Set(opts.map((o) => String(getValue(o))));
  //     onChange(value.filter((v) => !keys.has(String(getValue(v)))));
  //   } else {
  //     const keys = new Set(value.map((v) => String(getValue(v))));
  //     const toAdd = opts.filter((o) => !keys.has(String(getValue(o))));
  //     onChange([...value, ...toAdd]);
  //   }
  // };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => setOpen((o) => !o)}
        className={`min-h-[32px] w-full flex items-start gap-2 flex-wrap px-3 py-1 pr-10 rounded-lg border bg-white cursor-pointer transition-all duration-200 ${
          open
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
            : 'border-gray-200 hover:border-gray-300 shadow-sm'
        }`}
      >
        {(
          <span className="text-gray-400 text-sm self-center leading-6">{placeholder}</span>
        )}
        <ChevronDown
          size={16}
          className={`absolute right-3 top-2.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="absolute z-[999] mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <button
              onClick={selectAll}
              disabled={allSelected}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckSquare size={13} />
              Select All
            </button>
            <button
              onClick={deselectAll}
              disabled={noneSelected}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Square size={13} />
              Deselect All
            </button>
            {/* {value.length > 0 && (
              <span className="ml-auto text-xs text-gray-400">
                {value.length} selected
              </span>
            )} */}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filteredGroups.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">No results found</div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.title}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    // onClick={() => toggleGroup(group.option)}
                  >
                    {/* <span
                      className={`w-4 h-4 flex items-center justify-center rounded border transition-colors ${
                        groupIsAllSelected(group.option)
                          ? 'bg-blue-500 border-blue-500'
                          : groupIsPartialSelected(group.option)
                          ? 'bg-blue-100 border-blue-400'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {groupIsAllSelected(group.option) && (
                        <Check size={10} className="text-white" strokeWidth={3} />
                      )}
                      {groupIsPartialSelected(group.option) && (
                        <span className="w-2 h-0.5 bg-blue-500 rounded-full" />
                      )}
                    </span> */}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.title}
                    </span>
                    <span className="ml-auto text-xs text-gray-300">
                      {group.option.filter(isSelected).length}/{group.option.length}
                    </span>
                  </div>
                  {group.option.map((item) => (
                    <div
                      key={String(getValue(item))}
                      onClick={() => toggle(item)}
                      className={`flex items-center gap-3 pl-7 pr-3 py-2 cursor-pointer transition-colors ${
                        isSelected(item)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded border transition-colors ${
                          isSelected(item)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected(item) && (
                          <Check size={10} className="text-white" strokeWidth={3} />
                        )}
                      </span>
                      <span className="text-sm capitalize">{getLabel(item)}</span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
