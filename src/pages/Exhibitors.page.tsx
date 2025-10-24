import Card1 from "@/components/common/Exhibitors/Card1";
import Card2 from "@/components/common/Exhibitors/Card2";
import ExhibitorsTitlebar from "@/components/common/Exhibitors/ExhibitorsTitlebar";
import ExibitorSection from "@/components/common/Exhibitors/Section";

const Exhibitors_page = () => {
  return (
    <div className="mx-[7.5%]">
      <ExhibitorsTitlebar />
      <ExibitorSection title="Diamond Partners">
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card1 key={item} />
          ))}
        </div>
      </ExibitorSection>
      <ExibitorSection title="Platinum Partners">
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card1 key={item} />
          ))}
        </div>
      </ExibitorSection>
      <ExibitorSection title="Gold Partners">
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card2 key={item} />
          ))}
        </div>
      </ExibitorSection>
    </div>
  );
};

export default Exhibitors_page;
