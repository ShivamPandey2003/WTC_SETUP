import {
  useInfiniteExhibitors,
} from "@/api/global_api/global_api";
import ExibitorSection from "@/components/common/Exhibitors/Section";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
// import Exhibitors from "@/data/Exhibitors";
import ExhibitorCard from "@/v2_components/common/V2_Exhibitors/ExhibitorCard";
import ExhibitorModal from "@/v2_components/common/V2_Exhibitors/ExhibitorModal";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const V2_exhibitors_page = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    AllExhibitors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteExhibitors();

  const ExhibitorList = useMemo(() => {
    if (!AllExhibitors) return [];
    const newExhibitorsData = AllExhibitors.pages.flatMap((page) => page.response.data);
    if (!newExhibitorsData) return [];

    return newExhibitorsData;
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

  if (!ExhibitorList || !ExhibitorList.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 mx-auto">
      {ExhibitorList?.map((item) =>
        item.seq.map(
          (value, i) =>
            Boolean(item.grouped[value].length) && (
              <div key={i} className="mt-4">
                <h3 className="font-[700] text-[18px] text-[#353535] mb-6">
                  {value}
                </h3>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {item.grouped[value].map((item, i) => (
                    <ExhibitorCard
                      key={i}
                      {...item}
                      onClick={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>
            ),
        ),
      )}
      <ExhibitorModal
        data={ExhibitorList[0].seq.flatMap((pre) =>
          ExhibitorList[0].grouped[pre].map((s) => ({
            ...s,
            SponsorType: pre,
          })),
        )}
        id={selectedId as string}
        isOpen={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />

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
  );
};

export default V2_exhibitors_page;
