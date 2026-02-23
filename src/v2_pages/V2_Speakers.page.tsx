import { useInfiniteSpeakers } from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { setTitle } from "@/redux/ModalSlice";
import { setSpeaker } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch } from "@/redux/store";
// import { teamMembers } from "@/data/Speaker";
import SpeakerCard from "@/v2_components/common/V2_Speaker/SpeakerCard";
// import SpeakerModal from "@/v2_components/common/V2_Speaker/SpeakerModal";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const V2_Speakers_page = () => {
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    AllSpeakers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteSpeakers();

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
      <div className="w-full mx-auto">
        <div className="px-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
          {[1, 2, 3, 4, 5].map((val) => (
            <Skeleton key={val} className="w-[250px] h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Speakers Error" message={error.message} />
      </div>
    );
  }

  if (!AllSpeakers || !AllSpeakers.pages || !AllSpeakers.pages.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    // flex gap-4 flex-wrap items-start justify-center
    // grid-cols-5 gap-6
    <div className="w-full mx-auto">
      <div className="p-4 flex gap-4 flex-wrap items-start justify-center sm:justify-start">
        {SpeakersList.map((item, i) => (
          <SpeakerCard
            key={i}
            {...item}
            onClick={() => navigate(`/speaker/${item.speaker_id}`)}
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
  );
};

export default V2_Speakers_page;
