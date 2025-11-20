import { useGetExhibitorsList } from "@/api/global_api/global_api";
import Card1 from "@/components/common/Exhibitors/Card1";
import Card2 from "@/components/common/Exhibitors/Card2";
import ExhibitorsTitlebar from "@/components/common/Exhibitors/ExhibitorsTitlebar";
import ExibitorSection from "@/components/common/Exhibitors/Section";

const Exhibitors_page = () => {
  const { ExhibitorList, isPending } = useGetExhibitorsList();

  if (isPending) {
    return;
  }

  return (
    <div className="mx-[7.5%]">
      <ExhibitorsTitlebar />
      {ExhibitorList?.response.seq.map((item) => (
        <ExibitorSection key={item} title={item}>
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
