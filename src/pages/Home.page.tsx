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

  // console.log(atob("Z0FBQUFBQnBGWUZObzRLMldGTkhXQm9rNWNIY0JOSVBhZnFGME5HOEFQSHRtdVlnZDc3ZzFHUjVMa3ItUjdYX2tab1k3NG1XUVExZU5aXzhZXzlKOGFGaDE3QzVCQXA0Tm9GY2JOcU9OM1BYWW9ES0lIeHdKMlYwMGtwcUNXV1dMNFF3dWNULUxobWphQnBidUFvbUdlWHlXd1U2Q3pqTGpzRnByY3J2VXk1bTA5S3Mxb2M1YzE2YTFpdE9pYm5kLTl6dU5vQmN4X0VEdFVXWmpoR1hST1pyRlEyNjJKX0pWeWhIalp6UURzQmNxT21vckktYTIta0pIV1VfSGI1Qm1JbHFxZ0pabEdMU1BaWkdXaG8yVEx4akZiWWx5RlVUNUlseUw3dDRfWmxybmFBM3Zhd3o5UHh1WXo2Z1VEckYtVkRKdmxfdnRuZDR4ZW1jaUFyXzd0NlZ0YU9xcUNNekszTEJtbmttaHcxR2FjVnF3eHhiS3dmeUR2TlpZbzFYUEhySEs5eGRkYmFDN0NidEp5a2FfcTlOTEgyRVkzWkpCdz09"))

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
