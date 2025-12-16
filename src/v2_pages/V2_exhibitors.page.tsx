import Exhibitors from "@/data/Exhibitors";
import ExhibitorCard from "@/v2_components/common/V2_Exhibitors/ExhibitorCard";

const V2_exhibitors_page = () => {
  return (
    <div className="px-4 mx-auto">
      {Object.entries(Exhibitors).map(([key, value]) => (
        <div key={key} className="mt-4">
          <h3 className="font-[700] text-[18px] text-[#353535] mb-6">{key}</h3>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {value.map((item, i) => (
              <ExhibitorCard key={i} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default V2_exhibitors_page;
