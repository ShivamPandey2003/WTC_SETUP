import { useInfiniteExhibitors } from "@/api/global_api/global_api";
import ExibitorSection from "@/components/common/Exhibitors/Section";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setShowSearch } from "@/redux/ExhibitorSlice";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import Exhi_SplashScreen from "@/v2_components/common/V2_Exhibitors/Exhi_SplashScreen";
// import Exhibitors from "@/data/Exhibitors";
import ExhibitorCard from "@/v2_components/common/V2_Exhibitors/ExhibitorCard";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import ExhibitorsDetails from "./ExhibitorsDetails";

const adjustHexColor = (hex: string, amount: number): string => {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const V2_exhibitors_page = () => {
  const [spashScreen, setSpashScreen] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();
  const [selectedExhibitor, setSelectedExhibitor] = useState<string | null>(null);
  const {
    AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteExhibitors();

  const ExhibitorList = useMemo(() => {
    if (!AllExhibitors || !AllExhibitors.pages) return { grouped: {}, seq: [], colors: {} };

    const finalGrouped: Record<string, any[]> = {};
    const finalSeq = new Set<string>();
    const finalColors: Record<string, string> = {};


    AllExhibitors.pages.forEach((page) => {
      const data = page.response.data;

      if (!Object.keys(data).length) return;

      // collect keys (seq + dynamic keys)
      data.seq.forEach((key) => finalSeq.add(key));
      Object.keys(data.grouped).forEach((key) => finalSeq.add(key));

      // merge grouped data
      Object.entries(data.grouped).forEach(([key, list]) => {
        if (!finalGrouped[key]) {
          finalGrouped[key] = [];
        }

        finalGrouped[key].push(...list);
      });

      // merge colors
      if (data.colors) {
        Object.assign(finalColors, data.colors);
      }
    });

    return {
      grouped: finalGrouped,
      seq: Array.from(finalSeq),
      colors: finalColors,
    };
  }, [AllExhibitors]);

  useEffect(() => {
    if (ExhibitorList && Object.entries(ExhibitorList.grouped).length) {
      dispatch(setShowSearch(true));
    }
  }, [ExhibitorList]);

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
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(handleObserver);
    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  useEffect(() => {
    const isShowed = sessionStorage.getItem("Exhibitor_Splash");
    if (!isShowed) {
      setSpashScreen(true);
      sessionStorage.setItem("Exhibitor_Splash", JSON.stringify(true));
    }
  }, [setSpashScreen]);

  if (status === "pending") {
    return (
      <div className="mx-[7.5%]">
        {[1, 2].map((i) => (
          <ExibitorSection key={i} title={""}>
            <div className="flex gap-2">
              {[1, 2, 3].map((v) => (
                <Skeleton key={v} className="w-[200px] mr-2 h-[200px]" />
              ))}
            </div>
          </ExibitorSection>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Exhibitors Error" message={error.message} />
      </div>
    );
  }

  if (!ExhibitorList || !Object.keys(ExhibitorList.grouped).length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <>
      {selectedExhibitor && (
        <div
          className="fixed inset-0 z-6 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 sm:ml-32"
          onClick={() => setSelectedExhibitor(null)}
        >
          <div
            className="bg-white rounded-xl p-6 animate-in fade-in zoom-in-95 duration-200 max-w-9/12
             overflow-auto max-h-9/12"
            onClick={(e) => e.stopPropagation()}
          >
            <ExhibitorsDetails id={selectedExhibitor} close={() => setSelectedExhibitor(null)} />
          </div>
        </div>
      )}
      <div id="Exhibitors_Scroll" className="pb-4 mx-auto">
        {ExhibitorList.seq.map(
          (value, i) =>
            Boolean(ExhibitorList.grouped[value].length) && (
              <div key={i} className="mb-3 mx-5">
                <div className="flex title-bar w-full items-center justify-between gap-4 my-3 sticky top-14 z-3 from-80% bg-linear-to-b from-background to-transparent py-2">
                  <div className="w-10 h-2 rounded-full shadow-sm" style={{
                    background: `linear-gradient(135deg, ${adjustHexColor(ExhibitorList.colors[value] as string, 10)}, ${adjustHexColor(ExhibitorList.colors[value] as string, -10)})`,
                  }} />
                  <h4 className="font-[700] text-[26px]">
                    {value}
                  </h4>
                  <div className="w-full h-2 rounded-full shadow-sm" style={{
                    background: `linear-gradient(135deg, ${adjustHexColor(ExhibitorList.colors[value] as string, 10)}, ${adjustHexColor(ExhibitorList.colors[value] as string, -10)})`,
                  }} />
                </div>
                <div className="flex flex-wrap gap-4 px-4 justify-center sm:justify-start">
                  {ExhibitorList.grouped[value].map((item, i) => (
                    <ExhibitorCard
                      key={i}
                      {...item}
                      // onClick={() => navigation(`/exhibitors/${item.id}`)}
                      onClick={() => setSelectedExhibitor(item.id)}
                      colorTag={ExhibitorList?.colors && ExhibitorList.colors[value] as string}
                    />
                  ))}
                </div>
              </div>
            ),
        )}

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
        <Exhi_SplashScreen open={spashScreen} setOpen={setSpashScreen} />
      </div>
    </>
  );
};

export default V2_exhibitors_page;
