import BannerPreview from "@/components/common/Home_Design/BannerPreview";
import CreateModal from "@/components/common/Home_Design/CreateModal";
import CustomTable from "@/components/common/Home_Design/Table";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { setIsCreating } from "@/redux/HomeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Check, Plus, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const HomeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const dispatch = useDispatch<AppDispatch>();
  const {isCreating} = useSelector((state: RootState)=>state.Home_Design)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Home Design"
          onSave={() => {}}
          show={Boolean(value !== "News")}
        />
        {Boolean(value === "News") && (
          <div className="absolute right-10">
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-[80px] py-1 h-7"
            >
              <Plus />
              Add
            </Button>
          </div>
        )}
        <Tabs defaultValue={value} onValueChange={setValue} className="">
          <TabsList className="mb-4 pl-80 xxs:pl-60 xs:pl-0">
            <TabsTrigger
              variant={"link"}
              value={"General Settings"}
              className="text-[15px] font-[600] leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"News"}
              className="text-[15px] font-[600] leading-[15px] px-0"
            >
              News
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Tab Title">
              <input
                type="text"
                value={"News Feed"}
                onChange={(e) => console.log(e.target.value)}
                className="bg-[#1111110D] font-[600] px-5 py-1 text-sm text-black rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors"
              />
            </Section>
            <Section title="Carousel Display">
              <div className="flex items-center justify-between">
                <div className="w-1/2 flex flex-wrap gap-3">
                  {[
                    "Upcoming Session Info",
                    "Gold Exhibitors Info",
                    "Keynote Speakers Info",
                    "Advertisements",
                    "Exhibitors with Ad Subscription",
                  ].map((value, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-2 bg-[#1111110D] px-5 py-1 text-sm text-black font-[600] rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors",
                        index === 0 && "text-primary"
                      )}
                    >
                      {index === 0 && <Check />}
                      {value}
                    </div>
                  ))}
                </div>
                <div className="w-1/2">
                  <h3 className="text-[12px] font-[500] leading-[15px] mb-2">
                    Carousel Preview
                  </h3>
                  <div className="flex gap-2">
                    {[1, 2].map((value) =>
                      value === 1 ? (
                        <BannerPreview key={value} img="1234" />
                      ) : (
                        <BannerPreview key={value} />
                      )
                    )}
                  </div>
                </div>
              </div>
            </Section>
            <Section title="Info Cards">
              <p className="text-sm text-gray-700 flex gap-1">
                Data for info cards will be fetched from{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium flex items-center"
                >
                  News
                  <SquareArrowOutUpRight size={13} />
                </a>{" "}
                database.
              </p>
            </Section>
          </TabsContent>
          <TabsContent value="News">
            <CustomTable />
          </TabsContent>
        </Tabs>
      </div>
      <CreateModal isOpen={isCreating} onClose={() => dispatch(setIsCreating(false))} />
    </div>
  );
};

export default HomeDesign_page;
