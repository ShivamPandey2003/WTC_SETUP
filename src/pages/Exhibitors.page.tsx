import { useGetExhibitorsList } from "@/api/global_api/global_api";
import Card1 from "@/components/common/Exhibitors/Card1";
import Card2 from "@/components/common/Exhibitors/Card2";
import ExhibitorsTitlebar from "@/components/common/Exhibitors/ExhibitorsTitlebar";
import ExibitorSection from "@/components/common/Exhibitors/Section";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";

const Exhibitors_page = () => {
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
    return <div className="flex items-center justify-center h-[80vh]">
      <ErrorDisplay title="Exhibitors Error" message={error.message}/>
    </div>;
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
    <div className="mx-[7.5%]">
      <ExhibitorsTitlebar />
      {ExhibitorList?.response.seq.map((item) => (
        Boolean(ExhibitorList.response[item].length) && <ExibitorSection key={item} title={item}>
          <div className="flex gap-3 md:gap-5 flex-wrap lg:flex-nowrap justify-center md:justify-start">
            {ExhibitorList.response[item].map((exhibitor) =>
              item !== "Silver" && item !== "Gold" ? (
                <Card1 key={exhibitor.id} {...exhibitor} />
              ) : (
                <Card2 key={exhibitor.id} {...exhibitor} />
              )
            )}
          </div>
        </ExibitorSection>
      ))}
    </div>
  );
};

export default Exhibitors_page;
