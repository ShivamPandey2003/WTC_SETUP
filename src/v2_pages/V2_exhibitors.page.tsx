import { useGetExhibitorsList } from "@/api/global_api/global_api";
import ExibitorSection from "@/components/common/Exhibitors/Section";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
// import Exhibitors from "@/data/Exhibitors";
import ExhibitorCard from "@/v2_components/common/V2_Exhibitors/ExhibitorCard";
import ExhibitorModal from "@/v2_components/common/V2_Exhibitors/ExhibitorModal";
import { useState } from "react";

const V2_exhibitors_page = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { ExhibitorList, isPending, error } = useGetExhibitorsList();

  if (isPending) {
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

  if (
    !ExhibitorList ||
    !ExhibitorList.response ||
    !ExhibitorList.response.seq.length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 mx-auto">
      {ExhibitorList?.response.seq.map(
        (value, i) =>
          Boolean(ExhibitorList.response[value].length) && (
            <div key={i} className="mt-4">
              <h3 className="font-[700] text-[18px] text-[#353535] mb-6">
                {value}
              </h3>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {ExhibitorList.response[value].map((item, i) => (
                  <ExhibitorCard key={i} {...item} onClick={()=>setSelectedId(item.id)} />
                ))}
              </div>
            </div>
          ),
      )}
      <ExhibitorModal
        data={ExhibitorList.response.seq.flatMap((pre) =>
          ExhibitorList.response[pre].map((s) => ({
            ...s,
            SponsorType: pre,
          })),
        )}
        id={selectedId as string}
        isOpen={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default V2_exhibitors_page;
