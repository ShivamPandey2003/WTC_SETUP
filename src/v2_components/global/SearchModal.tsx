import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Search, X } from "lucide-react";
import { useInfiniteSearch } from "@/api/global_api/global_api";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocation, useNavigate } from "react-router";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { pathname } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  const { AllNews, status } = useInfiniteSearch({
    search: debouncedSearch,
    route: pathname,
  });

  const NewsList = useMemo(() => {
    if (!AllNews) return [];
    const newNewsData = AllNews.pages.flatMap(
      (page) => page.response.data ?? [],
    );
    if (!newNewsData.length) return [];

    return newNewsData;
  }, [AllNews]);

  const title =
    pathname === "/"
      ? "News"
      : pathname === "/speaker"
        ? "Speakers"
        : "Exhibitors";

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 outline-none text-lg placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-semibold my-6">{title}</h2>
          {status === "pending" ? (
            <div className="text-center text-gray-400 py-8">
              <LoaderCircle className="w-12 h-12 mx-auto mb-3 opacity-30 animate-spin" />
              <p>Data is Loading</p>
            </div>
          ) : NewsList.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start typing to search</p>
            </div>
          ) : (
            NewsList.map((item) => {
              if (pathname === "/") {
                return (
                  <div
                    className="flex items-start mb-6 gap-4 cursor-pointer"
                    key={item.id}
                    onClick={() => {
                      navigate(`/news/${item.id}`);
                      onClose();
                    }}
                  >
                    <img
                      src={item.bg_img as string}
                      alt={item.title}
                      className="h-[7rem] sm:h-[10rem] w-[11rem] sm:w-[15rem] rounded-2xl"
                    />
                    <div className="">
                      <h2 className="mb-2 line-clamp-2 font-bold sm:text-xl">
                        {item.title}
                      </h2>
                      <p className="line-clamp-4 text-xs sm:text-sm">{item.description}</p>
                    </div>
                  </div>
                );
              } else if (pathname === "/speaker") {
                return (
                  <div
                    className="flex items-start mb-6 gap-4 cursor-pointer"
                    key={item.speaker_id}
                    onClick={() => {
                      navigate(`/speaker/${item.speaker_id}`);
                      onClose();
                    }}
                  >
                    <img
                      src={item.user_img as string}
                      alt={item.name}
                      className="h-[7rem] sm:h-[10rem] w-[11rem] sm:w-[15rem] rounded-2xl object-cover"
                    />
                    <div className="">
                      <h2 className="mb-2 line-clamp-2 font-bold sm:text-xl">
                        {item.name}
                      </h2>
                      <p className="line-clamp-4 text-xs sm:text-sm">{item.bio}</p>
                    </div>
                  </div>
                );
              } else if (pathname === "/exhibitors") {
                return (
                  <div>
                    {item.seq.map((str: any) =>
                      item.grouped[str].map((value: any) => {
                        return (
                          <div
                            className="flex items-start mb-6 gap-4 cursor-pointer"
                            key={value.id}
                            onClick={() => {
                              navigate(`/exhibitors/${value.id}`);
                              onClose();
                            }}
                          >
                            <img
                              src={value.logo as string}
                              alt={value.full_name}
                              className="h-[7rem] sm:h-[10rem] w-[11rem] sm:w-[15rem] rounded-2xl object-contain bg-gray-300"
                            />
                            <div className="">
                              <h2 className="mb-2 line-clamp-2 font-bold sm:text-xl">
                                {value.full_name}
                              </h2>
                              <p className="line-clamp-4 text-xs sm:text-sm">
                                {value.email}
                              </p>
                              <p className="line-clamp-4 text-xs sm:text-sm">
                                {value.url}
                              </p>
                              <p className="line-clamp-4 text-xs sm:text-sm">
                                Type: {str}
                              </p>
                            </div>
                          </div>
                        );
                      }),
                    )}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
}
