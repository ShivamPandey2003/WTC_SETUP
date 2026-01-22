import { useGetNewsList, useHomeDesignUpdate } from "@/api/global_api/global_api";
import { useUploadNewsCSV } from "@/api/home_design_api/Home_design_api";
// import BannerPreview from "@/components/common/Home_Design/BannerPreview";
import CreateModal from "@/components/common/Home_Design/CreateModal";
import MiniSmallCarousel from "@/components/common/Home_Design/MiniCarousel";
import CustomTable from "@/components/common/Home_Design/Table";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import CSVModel from "@/components/global/CSVModel";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { setAppConfig } from "@/redux/GlobalDesignSlice";
import { setIsCreating, setUploadCSV } from "@/redux/HomeDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Check, Plus, SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const HomeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const { NewsList } = useGetNewsList();
  const dispatch = useDispatch<AppDispatch>();
  const { isCreating, uploadCSV } = useSelector((state: RootState) => state.Home_Design);
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const { UpdateHomeDesign, isUpdateHomeDesignPending } = useHomeDesignUpdate();
  const {UploadNewsCSV, isPending} = useUploadNewsCSV()

  if(!NewsList || !NewsList.response){
    return null
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Home Design"
          onSave={() => UpdateHomeDesign()}
          show={Boolean(value !== "News")}
          loading={isUpdateHomeDesignPending}
        />
        {Boolean(value === "News") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={() => dispatch(setUploadCSV(true))} className="w-fit py-1 h-7">
              <Plus />
              import CSV
            </Button>
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-20 py-1 h-7"
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
              className="text-[15px] font-semibold leading-[15px] px-0 mr-6"
            >
              General Settings
            </TabsTrigger>
            <TabsTrigger
              variant={"link"}
              value={"News"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              News
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="Tab Title" ClassName="w-full">
              <input
                type="text"
                value={appConfig.home_design.home_title}
                onChange={(e) =>
                  dispatch(
                    setAppConfig({
                      ...appConfig,
                      home_design: {
                        ...appConfig.home_design,
                        home_title: e.target.value,
                      },
                    }),
                  )
                }
                className="bg-[#1111110D] w-[23rem] font-semibold px-5 py-1 text-sm text-black rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors"
              />
            </Section>
            <div className="flex items-start gap-4">
              <Section title="Carousel Display" ClassName="w-full h-[210px]">
                <div className="flex items-center justify-between">
                  <div className="w-full flex flex-wrap gap-3">
                    {Object.keys(appConfig.home_design)
                      .filter((pre) => pre !== "home_title")
                      .map((value) => (
                        <div
                          key={value}
                          className={cn(
                            "flex items-center gap-2 bg-[#1111110D] px-3 py-1 text-sm text-black font-semibold rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors cursor-pointer",
                            appConfig.home_design[
                              value as keyof typeof appConfig.home_design
                            ] && "text-primary",
                          )}
                          onClick={() =>
                            dispatch(
                              setAppConfig({
                                ...appConfig,
                                home_design: {
                                  ...appConfig.home_design,
                                  [value]:
                                    !appConfig.home_design[
                                      value as keyof typeof appConfig.home_design
                                    ],
                                },
                              }),
                            )
                          }
                        >
                          {appConfig.home_design[
                            value as keyof typeof appConfig.home_design
                          ] && <Check size={20} />}
                          {value}
                        </div>
                      ))}
                  </div>
                </div>
              </Section>
              <Section title="Carousel Preview">
                <MiniSmallCarousel slides={NewsList.response.slice(0, 4)}/>
              </Section>
            </div>
            <Section title="Info Cards" ClassName="w-full">
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
      <CreateModal
        isOpen={isCreating}
        onClose={() => dispatch(setIsCreating(false))}
      />
      <CSVModel
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="News"
        isLoading={isPending}
        onSubmit={UploadNewsCSV}
        description="Upload CSV file to create News entries. CSV Columns: title, description, tile_space"
        path="/new-entry.csv"
      />
    </div>
  );
};

export default HomeDesign_page;
