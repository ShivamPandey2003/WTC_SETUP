import {
  useGetExhibitorsListPage,
  useInfiniteNews,
} from "@/api/global_api/global_api";
import { useHeroCarusole } from "@/api/home_design_api/Home_design_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { shuffleArray } from "@/lib/utils";
import { setNews } from "@/redux/ExtraSlice";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import HeroCarousel from "@/v2_components/common/V2_Home/HeroCarousel";
import NewsCard from "@/v2_components/common/V2_Home/NewsCard";
import SponserCarousal from "@/v2_components/common/V2_Home/SponserCarousal";
import NewsDetail from "@/v2_pages/NewsDetail";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

const V2_Home_page = () => {
  const [page, setPage] = useState<number>(1);
  const [carouselData, setCarouselData] = useState<
    Omit<Exhibitor, "category">[]
  >([]);
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const {
    AllNews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteNews();

  const { ExhibitorList, error: ExhibitorListError } =
    useGetExhibitorsListPage(page);

  const { HeroCarusole, isHeroCarusole, errorHeroCarusole } = useHeroCarusole();

  const NewsList = useMemo(() => {
    if (!AllNews) return [];
    const newNewsData = AllNews.pages.flatMap((page) => page.response.data);
    if (!newNewsData) return [];

    return newNewsData;
  }, [AllNews]);

  const CarusolData = useMemo(() => {
    if (HeroCarusole?.response) {
      return shuffleArray(HeroCarusole.response);
    }
    return [];
  }, [HeroCarusole]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  useEffect(() => {
    if (!ExhibitorList || !ExhibitorList.response) return;
    setCarouselData((pre) => [...pre, ...ExhibitorList.response.data]);
  }, [ExhibitorList]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(handleObserver);
    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (!NewsList.length) return;
    dispatch(setNews(NewsList));
  }, [NewsList]);

  useEffect(() => {
    const n = searchParams.get("n");
    if (n) setSelectedNews(n);
  }, [searchParams]);

  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedNews]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (status === "pending" || isHeroCarusole) {
    return (
      <div className="w-full px-4">
        <div className="navbar flex justify-between py-2">
          <div className="left-header">
            <Skeleton className="w-[150px] h-7" />
          </div>
          <div className="right-header flex gap-4 mb-2">
            <Skeleton className="w-[200px] h-10" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-center gap-6 md:gap-8">
          <Skeleton className="w-full lg:col-span-2 h-[59vh]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[28vh]" />
            <Skeleton className="w-full h-[28vh]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4">
          <Skeleton className="w-full h-[28vh]" />
          <Skeleton className="w-full h-[28vh]" />
          <Skeleton className="w-full h-[28vh]" />
        </div>
      </div>
    );
  }

  if (status === "error" || ExhibitorListError || errorHeroCarusole) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="News Feed Error"
          message={String(
            error?.message ??
            ExhibitorListError?.message ??
            errorHeroCarusole?.message,
          )}
        />
      </div>
    );
  }

  if (!AllNews || !AllNews.pages || !AllNews.pages.length || !NewsList.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <>
      {selectedNews && (
        <div
          className="fixed inset-0 z-5 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 sm:ml-32"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-xl p-6 animate-in fade-in zoom-in-95 duration-200 max-w-9/12 overflow-auto max-h-9/12"
            onClick={(e) => e.stopPropagation()}
          >
            <NewsDetail id={selectedNews} close={() => setSelectedNews(null)} />
          </div>
        </div>
      )}
      <div className="px-4 pb-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[58vh] flex justify-center">
            {HeroCarusole?.response &&
              HeroCarusole.response.length > 0 &&
              CarusolData.length > 0 ? (
              <HeroCarousel slides={CarusolData} />
            ) : (
              <Skeleton className="h-[1/2vh] md:h-[530px] shadow rounded-xl bg-gray-300" />
            )}
          </div>
          <div className="space-y-4">
            {NewsList.slice(0, 2).map((item, index) => (
              <NewsCard
                key={index}
                {...item}
                className=""
                bg_img={item.bg_img}
                onClick={() => setSelectedNews(item.id)}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {NewsList.slice(2, 4).map((item, index) => (
              <NewsCard
                key={index}
                {...item}
                bg_img={item.bg_img}
                onClick={() => setSelectedNews(item.id)}
              />
            ))}
          </div>
          <div>
            {carouselData.length > 0 ? (
              <SponserCarousal
                max={ExhibitorList?.response.max_page as number}
                page={page}
                slides={carouselData}
                intervalTime={7000}
                setPage={setPage}
              />
            ) : (
              <Skeleton className="min-h-[255px] shadow rounded-xl bg-gray-300" />
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {NewsList.slice(4, NewsList.length).map((item, index) => (
            <NewsCard
              key={index}
              {...item}
              bg_img={item.bg_img}
              onClick={() => setSelectedNews(item.id)}
            />
          ))}
        </div>
        <div
          ref={loadMoreRef}
          className="w-full flex items-center justify-center my-4"
        >
          {isFetchingNextPage ? (
            <Loader size={30} className="animate-spin text-primary" />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default V2_Home_page;
