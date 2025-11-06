import { useGetNewsList, useGlobalDesign } from "@/api/global_api/global_api";
import HeroCard from "@/components/common/Home/HeroCard";
import OtherCard from "@/components/common/Home/OtherCard";
import { cn } from "@/lib/utils";

const Home_page = () => {
  const {
    isGlobalDesignPending,
    error: DesignError,
  } = useGlobalDesign();
  const { NewsList, isPending, error } = useGetNewsList();

  if (isPending || isGlobalDesignPending) {
    return;
  }

  if (error || DesignError) {
    return <div>{error?.message ?? DesignError?.message}</div>;
  }

  return (
    <div className="mx-[7.5%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-6 md:gap-8">
        <HeroCard img={"1234"} />
        <HeroCard />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {NewsList?.response.map((item) => (
          <OtherCard
            key={item.id}
            title={item.title}
            description={item.description}
            classname={cn(item.tile_space === "2x" && "sm:col-span-2")}
          />
        ))}
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        <OtherCard classname=""/>
        <OtherCard classname="sm:col-span-2"/>
        <OtherCard/>
      </div> */}
    </div>
  );
};

export default Home_page;
