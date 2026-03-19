import {
  useGlobalDesign,
  useHomeDesignUpdate,
  useUploadLogo,
} from "@/api/global_api/global_api";
import {
  useGetNewsList,
  useHeroCarusole,
  useNewsDownload,
  useUpdateSplash,
  useUploadNewsCSV,
} from "@/api/home_design_api/Home_design_api";
import { useGetCategoryAll } from "@/api/programme_design_api/Programme_design_api";
// import BannerPreview from "@/components/common/Home_Design/BannerPreview";
import CreateModal from "@/components/common/Home_Design/CreateModal";
import MiniSmallCarousel from "@/components/common/Home_Design/MiniCarousel";
import CustomTable from "@/components/common/Home_Design/Table";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import CSVModel from "@/components/global/CSVModel";
import ErrorModal from "@/components/global/ErrorModal";
import Section from "@/components/global/Section";
// import TextStyleRow from "@/components/global/TextStyleRow";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { cn } from "@/lib/utils";
import { setAppConfig } from "@/redux/GlobalDesignSlice";
import { setIsCreating, setUploadCSV } from "@/redux/HomeDesignSlice";
import { setResponseModal } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Check,
  Download,
  Plus,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const HomeDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const { isGlobalDesignPending } = useGlobalDesign();
  const { AllCategory, isPending: isCategoriesPending } = useGetCategoryAll();
  const { NewsList } = useGetNewsList();
  const dispatch = useDispatch<AppDispatch>();
  const {
    isCreating,
    uploadCSV,
    news = [],
  } = useSelector((state: RootState) => state.Home_Design);
  const { responseModal, responseData } = useSelector(
    (state: RootState) => state.model,
  );
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const { UpdateHomeDesign, isUpdateHomeDesignPending, HomeDesignUpdateData } = useHomeDesignUpdate();
  const { UploadNewsCSV, isPending } = useUploadNewsCSV();
  const { UploadLogo, isPending: SplashScreenIsUpdating } = useUploadLogo();
  const { UpdateSplashActivation, isPending: isUpdateSplashActivation } =
    useUpdateSplash();
  const { HeroCarusole, refetch } = useHeroCarusole();
  const { downloadNews, isdownloadPending } = useNewsDownload();

  const OnSave = () => {
    const formData = new FormData();
    formData.append("file", appConfig.splash.image);

    UploadLogo({
      type: 5,
      extra: `&title=${appConfig.splash.title}&subtitle=${appConfig.splash.subtitle}`,
      form: formData,
    });
  };

  const Filter = useMemo(() => {
    if (
      !AllCategory ||
      !AllCategory.response ||
      AllCategory.response.length === 0
    ) {
      return [];
    }

    const newValue = [
      ...new Set(AllCategory.response.map((item) => item.type)),
    ];

    return newValue;
  }, [AllCategory]);

  useEffect(()=>{
    if(HomeDesignUpdateData?.header.code === 200){
      refetch()
    }
  },[HomeDesignUpdateData])

  if (
    !NewsList ||
    !NewsList.response ||
    !HeroCarusole ||
    !HeroCarusole.response ||
    isGlobalDesignPending ||
    isCategoriesPending
  ) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Home Design"
          onSave={() => UpdateHomeDesign()}
          show={false}
          loading={isUpdateHomeDesignPending}
        />
        {Boolean(value === "News") && (
          <div className="absolute right-10 flex items-center gap-4">
            {news.length > 0 && (
              <Button
                onClick={() => downloadNews()}
                disabled={isdownloadPending}
                className="w-fit py-1 h-7"
              >
                <Download />
                Download
              </Button>
            )}
            <Button
              onClick={() => dispatch(setUploadCSV(true))}
              className="w-fit py-1 h-7"
            >
              <Upload />
              Upload
            </Button>
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-fit py-1 h-7"
            >
              <Plus />
              Add News
            </Button>
          </div>
        )}
        <Tabs value={value} onValueChange={setValue} className="">
          <TabsList className="pl-80 xxs:pl-60 xs:pl-0">
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
            <div className="flex gap-4">
              <Section
                title="Tab Title"
                ClassName="w-3/5"
                onSave={() => UpdateHomeDesign()}
                show={true}
                loading={isUpdateHomeDesignPending}
              >
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
                  className="bg-[#1111110D] w-[23rem] font-semibold px-5 py-1 text-sm text-black rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </Section>
              <Section
                title="Info Cards"
                ClassName="w-2/5"
                onSave={() => UpdateHomeDesign()}
                show={false}
                loading={isUpdateHomeDesignPending}
              >
                <div className="text-sm text-gray-700 flex gap-1">
                  Data for info cards will be fetched from{" "}
                  <div
                    onClick={() => setValue("News")}
                    className="text-primary hover:underline font-medium flex items-center cursor-pointer"
                  >
                    News
                    <SquareArrowOutUpRight size={13} />
                  </div>{" "}
                  database.
                </div>
              </Section>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3/5">
                <Section
                  title="Carousel Display"
                  ClassName="w-full"
                  onSave={() => UpdateHomeDesign()}
                  show={true}
                  loading={isUpdateHomeDesignPending}
                >
                  <div className="flex flex-col gap-8">
                    {Filter.map((val) => {
                      return (
                        <div key={val}>
                          <h3 className="mb-2 font-semibold">
                            {val === 0
                              ? `Programme (${
                                  AllCategory?.response.filter(
                                    (pre) =>
                                      pre.type === val &&
                                      appConfig.home_design.categories.includes(
                                        pre.id,
                                      ),
                                  ).length
                                })`
                              : `Exhibitor (${
                                  AllCategory?.response.filter(
                                    (pre) =>
                                      pre.type === val &&
                                      appConfig.home_design.categories.includes(
                                        pre.id,
                                      ),
                                  ).length
                                })`}
                          </h3>
                          <div className="w-full flex flex-wrap gap-3">
                            {AllCategory?.response
                              .filter((pre) => pre.type === val)
                              .map((p) => {
                                return (
                                  <div
                                    key={p.id}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-1 bg-[#1111110D] text-sm text-[#303030] font-semibold rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors cursor-pointer capitalize",
                                      appConfig.home_design.categories.includes(
                                        p.id,
                                      ) && `bg-primary text-white`,
                                    )}
                                    // style={{
                                    //   backgroundColor:
                                    //     appConfig.home_design.categories.includes(
                                    //       p.id,
                                    //     )
                                    //       ? p.color
                                    //       : "#1111110D",
                                    // }}
                                    onClick={() => {
                                      const categories =
                                        appConfig.home_design.categories;

                                      const updatedCategories =
                                        categories.includes(p.id)
                                          ? categories.filter(
                                              (id) => id !== p.id,
                                            ) // remove
                                          : [...categories, p.id]; // add

                                      dispatch(
                                        setAppConfig({
                                          ...appConfig,
                                          home_design: {
                                            ...appConfig.home_design,
                                            categories: updatedCategories,
                                          },
                                        }),
                                      );
                                    }}
                                  >
                                    {appConfig.home_design.categories.includes(
                                      p.id,
                                    ) && <Check size={20} />}
                                    <div>{p.name}</div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <h3 className="mb-2 font-semibold">Speaker</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-6">
                          <div
                            className={cn(
                              "flex items-center gap-2 px-3 py-1 bg-[#1111110D] text-sm text-[#303030] font-semibold rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors cursor-pointer capitalize",
                              appConfig.home_design.show_carusole &&
                                `bg-primary text-white`,
                            )}
                            // style={{
                            //   backgroundColor:
                            //     appConfig.home_design.categories.includes(
                            //       p.id,
                            //     )
                            //       ? p.color
                            //       : "#1111110D",
                            // }}
                            onClick={() => {
                              dispatch(
                                setAppConfig({
                                  ...appConfig,
                                  home_design: {
                                    ...appConfig.home_design,
                                    show_carusole:
                                      !appConfig.home_design.show_carusole,
                                  },
                                }),
                              );
                            }}
                          >
                            {appConfig.home_design.show_carusole && (
                              <Check size={20} />
                            )}
                            <div>{"All Speakers"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div
                            className={cn(
                              "flex items-center gap-2 px-3 py-1 bg-[#1111110D] text-sm text-[#303030] font-semibold rounded-[7px] text-center border border-transparent hover:border-gray-300 focus:border-[#318061] focus:outline-none focus:ring-1 focus:ring-[#318061] transition-colors cursor-pointer capitalize",
                              appConfig.home_design.key_note_speaker &&
                                `bg-primary text-white`,
                            )}
                            // style={{
                            //   backgroundColor:
                            //     appConfig.home_design.categories.includes(
                            //       p.id,
                            //     )
                            //       ? p.color
                            //       : "#1111110D",
                            // }}
                            onClick={() => {
                              dispatch(
                                setAppConfig({
                                  ...appConfig,
                                  home_design: {
                                    ...appConfig.home_design,
                                    key_note_speaker:
                                      !appConfig.home_design.key_note_speaker,
                                  },
                                }),
                              );
                            }}
                          >
                            {appConfig.home_design.key_note_speaker && (
                              <Check size={20} />
                            )}
                            <div>{"Keynote Speakers"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>
                <Section
                  title="Splash Screen"
                  ClassName="w-full"
                  onSave={() => OnSave()}
                  show={true}
                  loading={SplashScreenIsUpdating}
                >
                  {/* <TextStyleRow
                    label={"Title"}
                    value={appConfig.splash.title}
                    onChange={(e) =>
                      dispatch(
                        setAppConfig({
                          ...appConfig,
                          splash: { ...appConfig.splash, title: e },
                        }),
                      )
                    }
                  /> */}
                  {/* <TextStyleRow
                    label={"Subtitle"}
                    value={appConfig.splash.subtitle}
                    onChange={(e) =>
                      dispatch(
                        setAppConfig({
                          ...appConfig,
                          splash: { ...appConfig.splash, subtitle: e },
                        }),
                      )
                    }
                  /> */}
                  <div className="flex items-start gap-4 py-2">
                    <div className="text-sm font-[500] w-[220px] shrink-0">
                      Background Image
                    </div>
                    <input
                      type="file"
                      multiple={false}
                      accept={"image/*"}
                      onChange={(e) => {
                        dispatch(
                          setAppConfig({
                            ...appConfig,
                            splash: {
                              ...appConfig.splash,
                              image: e.target.files?.[0],
                            },
                          }),
                        );
                      }}
                      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {appConfig.splash.image && (
                      <img
                        src={
                          typeof appConfig.splash.image === "string"
                            ? appConfig.splash.image
                            : URL.createObjectURL(appConfig.splash.image)
                        }
                        alt=""
                        className="w-40 rounded-lg"
                      />
                    )}
                  </div>
                </Section>
              </div>
              <div className="w-2/5">
                <Section
                  title="Carousel Preview"
                  ClassName="w-full"
                  onSave={() => UpdateHomeDesign()}
                  show={false}
                  loading={isUpdateHomeDesignPending}
                >
                  <MiniSmallCarousel slides={HeroCarusole.response} />
                </Section>
                <Section
                  title="Splash Screen Activation"
                  ClassName="w-full"
                  onSave={() => UpdateSplashActivation()}
                  show={true}
                  loading={isUpdateSplashActivation}
                >
                  <div className="flex items-center py-2">
                    <div className="w-40 text-sm font-medium mr-8">
                      {"Activate Splash Screen"}
                    </div>
                    <ToggleSwitch
                      isOpen={appConfig.show_splash}
                      setIsOn={() =>
                        dispatch(
                          setAppConfig({
                            ...appConfig,
                            show_splash: !appConfig.show_splash,
                          }),
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center py-2">
                    <div className="w-52 text-sm font-medium mr-8">
                      {"Activate Exhibitor Splash Screen"}
                    </div>
                    <ToggleSwitch
                      isOpen={appConfig.show_exhibitor_splash}
                      setIsOn={() =>
                        dispatch(
                          setAppConfig({
                            ...appConfig,
                            show_exhibitor_splash:
                              !appConfig.show_exhibitor_splash,
                          }),
                        )
                      }
                    />
                  </div>
                </Section>
              </div>
            </div>
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
        ImageDescription="Upload a ZIP file containing images for News entries. The image file names should match the corresponding Images IDs."
        path="/new-entry.csv"
        type={5}
      />
      {responseModal && (
        <ErrorModal
          isOpen={responseModal}
          onClose={() => dispatch(setResponseModal(false))}
          data={responseData}
        />
      )}
    </div>
  );
};

export default HomeDesign_page;
