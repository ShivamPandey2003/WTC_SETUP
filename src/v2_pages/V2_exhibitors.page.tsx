import { useInfiniteExhibitors } from "@/api/global_api/global_api";
import ExibitorSection from "@/components/common/Exhibitors/Section";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import Exhi_SplashScreen from "@/v2_components/common/V2_Exhibitors/Exhi_SplashScreen";
// import Exhibitors from "@/data/Exhibitors";
import ExhibitorCard from "@/v2_components/common/V2_Exhibitors/ExhibitorCard";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const V2_exhibitors_page = () => {
  const [spashScreen, setSpashScreen] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigate();
  const {
    AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteExhibitors();

  const ExhibitorList = useMemo(() => {
    if (!AllExhibitors) return { grouped: {}, seq: [] };

    const finalGrouped: Record<string, any[]> = {};
    const finalSeq = new Set<string>();

    AllExhibitors.pages.forEach((page) => {
      const data = page.response.data;

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
    });

    return {
      grouped: finalGrouped,
      seq: Array.from(finalSeq),
    };
  }, [AllExhibitors]);

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

  // useEffect(() => {
  //   if (!ExhibitorList.length || !Object.keys(ExhibitorList[0]).length) return;

  //   dispatch(
  //     setExhibitors(
  //       ExhibitorList.flatMap((item) =>
  //         item.seq.flatMap((pr) =>
  //           item.grouped[pr].map((s) => ({ ...s, SponsorType: pr })),
  //         ),
  //       ),
  //     ),
  //   );
  // }, [ExhibitorList]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  useEffect(() => {
    const isShowed = sessionStorage.getItem("Exhibitor_Splash");
    if (!isShowed) {
      setSpashScreen(true);
      sessionStorage.setItem("Exhibitor_Splash", JSON.stringify(true));
    }
    // const timer = setTimeout(() => {
    //   setSpashScreen(false);
    // }, 6000);

    // return () => clearTimeout(timer);
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
    <div className="px-4 pb-4 mx-auto">
      {ExhibitorList.seq.map(
        (value, i) =>
          Boolean(ExhibitorList.grouped[value].length) && (
            <div key={i} className="mt-4">
              <h3 className="font-[700] text-[18px] text-[#353535] mb-6">
                {value}
              </h3>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {ExhibitorList.grouped[value].map((item, i) => (
                  <ExhibitorCard
                    key={i}
                    {...item}
                    onClick={() => navigation(`/exhibitors/${item.id}`)}
                  />
                ))}
              </div>
            </div>
          ),
      )}
      {/* <ExhibitorModal
        data={ExhibitorList[0].seq.flatMap((pre) =>
          ExhibitorList[0].grouped[pre].map((s) => ({
            ...s,
            SponsorType: pre,
          })),
        )}
        id={selectedId as string}
        isOpen={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      /> */}

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
  );
};

export default V2_exhibitors_page;
