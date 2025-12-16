import AdCard from "@/v2_components/common/V2_Home/AdCard";
import EventCard from "@/v2_components/common/V2_Home/EventCard";
import HeroCarousel from "@/v2_components/common/V2_Home/HeroCarousel";
import NewsCard from "@/v2_components/common/V2_Home/NewsCard";

const events = [
  {
    title: "The Effect of AI on Tunnelling",
    time: "9:00- 10:00 AM",
    description:
      "Artificial intelligence is transforming the tunnelling industry by enhancing safety, efficiency, an",
    tags: ["Technical", "Center Hall 7", "1 Hour"],
  },
  {
    title: "Open discussion Session",
    time: "9:00- 10:00 AM",
    description:
      "Artificial intelligence is transforming the tunnelling industry by enhancing safety, efficiency, an",
    tags: ["Technical", "Center Hall 7", "1 Hour"],
  },
];

const news = [
  {
    title: "WTC 2026 to Combine Hands with Canadian Hospitality",
    description:
      "WTC 2026 is set to combine cutting-edge research with authentic Canadian hospitality.As per reports this is going tobe the biggest collaboration yet with bid benefits ...",
  },
  {
    title:
      "Industry Leader and Renowned Figure Heinz Ehrbar talks about the Future",
    description:
      "WTC 2026 is set to combine cutting-edge research with authentic Canadian hospitality.As per reports this is going tobe the biggest collaboration yet with bid benefits ...",
  },
];

const V2_Home_page = () => {
  return (
    <div className="px-4 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeroCarousel />
        </div>
        <div className="space-y-4">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
        <div>
          <AdCard
            title="Epiroc"
            subtitle="Inspired By Innovation"
            image="https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=1600"
            buttonText="More info"
            onButtonClick={() => console.log("Ad clicked")}
          />
        </div>
      </div>
    </div>
  );
};

export default V2_Home_page;
