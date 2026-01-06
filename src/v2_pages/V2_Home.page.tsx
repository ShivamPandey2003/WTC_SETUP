import {
  useGetExhibitorsList,
  useGetNewsList,
} from "@/api/global_api/global_api";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { Skeleton } from "@/components/ui/skeleton";
// import EventCard from "@/v2_components/common/V2_Home/EventCard";
import HeroCarousel, {
  type Slide,
} from "@/v2_components/common/V2_Home/HeroCarousel";
import NewsCard from "@/v2_components/common/V2_Home/NewsCard";
import SponserCarousal from "@/v2_components/common/V2_Home/SponserCarousal";

const slides: Slide[] = [
  {
    id: 1,
    title: "World Tunnel",
    subtitle: "Congress 2026",
    description: "We Welcome You All To Montreal",
    image:
      "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "More info",
  },
  {
    id: 2,
    title: "Innovation in",
    subtitle: "Tunneling",
    description: "Advancing Underground Infrastructure",
    image:
      "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "Learn more",
  },
  {
    id: 3,
    title: "Sustainable",
    subtitle: "Solutions",
    description: "Building the Future Underground",
    image:
      "https://images.pexels.com/photos/1103969/pexels-photo-1103969.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "Explore",
  },
];
// const slides2 = [
//   {
//     id: 1,
//     title: "Diamond",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/7/79/Epiroc_Logo.png",
//     url: "https://www.epiroc.com",
//   },
//   {
//     id: 2,
//     title: "Diamond",
//     image:
//       "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Trimble_logo.svg/500px-Trimble_logo.svg.png",
//     url: "https://www.trimble.com",
//   },
//   {
//     id: 3,
//     title: "Diamond",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Bentley_Systems_wordmark.svg/500px-Bentley_Systems_wordmark.svg.png",
//     url: "https://www.bentley.com",
//   },
// ];

const V2_Home_page = () => {
  const { NewsList, isPending, error } = useGetNewsList();
  const {
    ExhibitorList,
    isPending: isExhibitorsListLoading,
    error: ExhibitorListError,
  } = useGetExhibitorsList();
  // const {
  //   ProgrammeList,
  //   isPending: isProgrammePending,
  //   error: programmeError,
  // } = useGetProgrammeList2();

  if (
    isPending ||
    isExhibitorsListLoading
    // isProgrammePending ||
    // !ProgrammeList ||
    // !ProgrammeList.response.programme["Nov 30, 2025"]
  ) {
    return (
      <div className="mx-[7.5%]">
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-center gap-6 md:gap-8">
          <Skeleton className="w-full lg:col-span-2 h-[420px]" />
          <Skeleton className="w-full h-[420px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4">
          <Skeleton className="w-full h-[180px]" />
          <Skeleton className="w-full h-[180px]" />
          <Skeleton className="w-full h-[180px]" />
        </div>
      </div>
    );
  }

  if (error || ExhibitorListError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="News Feed Error"
          message={String(error?.message ?? ExhibitorListError?.message)}
        />
      </div>
    );
  }

  if (
    !NewsList ||
    !NewsList.response ||
    !NewsList.response.length ||
    !ExhibitorList ||
    !ExhibitorList.response
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }
  return (
    <div className="px-4 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeroCarousel slides={slides} />
        </div>
        <div className="space-y-4">
          {NewsList.response.slice(0, 2).map((item, index) => (
            <NewsCard key={index} {...item} className="h-50" />
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {NewsList.response.slice(3, 5).map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
        <div>
          {/* <AdCard
            title="Epiroc"
            subtitle="Inspired By Innovation"
            image="https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=1600"
            buttonText="More info"
            onButtonClick={() => console.log("Ad clicked")}
          /> */}
          <SponserCarousal slides={ExhibitorList.response["Diamond"].slice(0,4)} intervalTime={7000} />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
        {NewsList.response
          .slice(3, NewsList.response.length)
          .map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
      </div>
    </div>
  );
};

export default V2_Home_page;
