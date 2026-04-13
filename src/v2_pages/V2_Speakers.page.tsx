import { useInfiniteSpeakers } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import { setSpeaker } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch } from "@/redux/store";
import SpeakerCard from "@/v2_components/common/V2_Speaker/SpeakerCard";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SpeakerDetails from "./SpeakerDetails";
import { useSearchParams } from "react-router";

const V2_Speakers_page = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const {
    AllSpeakers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteSpeakers();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("s");
    if (s) {
      setSelectedSpeaker(s);
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedSpeaker])

  const SpeakersList = useMemo(() => {
    if (!AllSpeakers) return [];
    const newData = AllSpeakers.pages.flatMap((page) => page.response.data);
    if (!newData) return [];

    return newData;
  }, [AllSpeakers]);

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
    if (!SpeakersList.length) return;

    dispatch(setSpeaker(SpeakersList));
  }, [SpeakersList]);

  useEffect(() => {
    dispatch(setTitle(null));
  }, []);

  if (status === "pending") {
    return (
      <>
        {selectedSpeaker && (
          <div
            className="fixed inset-0 z-5 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 sm:ml-32"
            onClick={() => setSelectedSpeaker(null)}
          >
            <div
              className="bg-white rounded-xl p-6 animate-in fade-in zoom-in-95 duration-200 max-w-9/12 overflow-auto max-h-9/12"
              onClick={(e) => e.stopPropagation()}
            >
              <SpeakerDetails id={selectedSpeaker} close={() => setSelectedSpeaker(null)} />
            </div>
          </div>
        )}
        <div className="w-full mx-auto">
          <div className="navbar flex justify-between px-4 py-2">
            <div className="left-header">
              <Skeleton className="w-[150px] h-7" />
            </div>
            <div className="right-header flex gap-4 mb-5">
              <Skeleton className="w-[200px] h-10" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
          <div className="px-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((val) => (
              <Skeleton key={val} className="w-[250px] h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Speakers Error" message={error.message} />
      </div>
    );
  }

  if (!AllSpeakers || !AllSpeakers.pages || !AllSpeakers.pages.length || !SpeakersList.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    // flex gap-4 flex-wrap items-start justify-center
    // grid-cols-5 gap-6
    <>
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-5 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 sm:ml-32"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-white rounded-xl p-6 animate-in fade-in zoom-in-95 duration-200 max-w-9/12
             overflow-auto max-h-9/12"
            onClick={(e) => e.stopPropagation()}
          >
            <SpeakerDetails id={selectedSpeaker} close={() => setSelectedSpeaker(null)} />
          </div>
        </div>
      )}
      <div className="w-full mx-auto">
        <div className="p-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
          {SpeakersList.map((item, i) => (
            <SpeakerCard
              key={i}
              {...item}
              // onClick={() => navigate(`/speaker/${item.speaker_id}`)}
              onClick={() => setSelectedSpeaker(item.speaker_id)}
            />
          ))}
        </div>
        {/* <SpeakerModal
        data={SpeakersList}
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
      </div>
    </>
  );
};

export default V2_Speakers_page;
