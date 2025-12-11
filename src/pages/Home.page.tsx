import { useGetNewsList } from "@/api/global_api/global_api";
import Carousel from "@/components/common/Home/Carousel";
import HeroCard from "@/components/common/Home/HeroCard";
import OtherCard from "@/components/common/Home/OtherCard";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Home_page = () => {
  const { NewsList, isPending, error } = useGetNewsList();

  if (isPending) {
    return <div className="mx-[7.5%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-6 md:gap-8">
        <Skeleton className="w-full h-80"/>
        <Skeleton className="w-full h-80"/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        <Skeleton className="w-full h-[180px]"/>
        <Skeleton className="w-full h-[180px] col-span-2"/>
        <Skeleton className="w-full h-[180px]"/>
      </div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-[80vh]">
      <ErrorDisplay title="News Feed Error" message={error.message}/>
    </div>;
  }

  if (!NewsList || !NewsList.response || !NewsList.response.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="mx-[7.5%]">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-6 md:gap-8">
        <HeroCard img={"1234"} />
        <HeroCard />
      </div> */}
      <Carousel/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {NewsList.response.map((item) => (
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
