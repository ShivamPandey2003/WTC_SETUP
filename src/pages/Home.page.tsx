import HeroCard from "@/components/common/Home/HeroCard";
import OtherCard from "@/components/common/Home/OtherCard";

const Home_page = () => {
  return (
    <div className="mx-[7.5%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 px-4 justify-center gap-6 md:gap-8">
          <HeroCard img={"1234"}/>
          <HeroCard/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-6 my-4">
        <OtherCard classname="sm:col-span-2"/>
        <OtherCard/>
        <OtherCard/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-6 my-4">
        <OtherCard classname="sm:col-span-2 lg:col-span-1"/>
        <OtherCard classname="col-span-1 lg:col-span-2"/>
        <OtherCard/>
      </div>
    </div>
  );
};

export default Home_page;
