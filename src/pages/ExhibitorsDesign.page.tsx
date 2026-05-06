import Custom_Text_Row from "@/components/common/Exhibitors_Design/Custom_Text_Row";
import CustomTable from "@/components/common/Exhibitors_Design/CustomTable";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Download, GripVertical, Loader, Plus, Upload, X } from "lucide-react";
import React, { useEffect } from "react";
import CreateModal from "@/components/common/Exhibitors_Design/CreateModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  setCategoryModal,
  setDeletingCategory,
  setIsCreating,
  setIsEditable,
  setSearchText,
  setUploadCSV,
} from "@/redux/ExhibitorSlice";
import {
  useExhibitorCategoryList,
  useGeneralExhibitorsUpdate,
  useGlobalDesign,
} from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
// import ErrorDisplay from "@/components/global/ErrorDisplay";
// import NoData from "@/components/global/NoData";
import CSVModel from "@/components/global/CSVModel";
import {
  useChangeExhibitorSeq,
  useExhibitorsDownload,
  useUploadExhibitorsCSV,
  useUploadSplash,
} from "@/api/exhibitor_design_api/exhibitor_design_api";
import TextStyleRow from "@/components/global/TextStyleRow";
import AddCategoryModel from "@/components/common/Exhibitors_Design/AddCategoryModel";
import DeleteModal from "@/components/global/DeleteModel";
import { useDeleteCategory } from "@/api/programme_design_api/Programme_design_api";
import { setResponseModal } from "@/redux/ModalSlice";
import ErrorModal from "@/components/global/ErrorModal";
import { apiRequest } from "@/services/apiService";
import axios from "axios";

const ExhibitorsDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const [splashValue, setSplashValue] = React.useState<{
    image: string | File;
    title: string;
    subtitle: string;
    file_path?: string;
  }>({ image: "", title: "", subtitle: "", file_path: "" });
  const { UploadExhibitorsCSV, isPending: isUploadPending } =
    useUploadExhibitorsCSV();
  const { Category, isCategoryPending } = useExhibitorCategoryList();
  const {changeExhibitorSeq} = useChangeExhibitorSeq()
  const dispatch = useDispatch();
  const {
    // SpeakerSettings: SettingValue,
    isPending,
    // error,
  } = useGetSpeakerSetting();
  const { GlobalDesign, isGlobalDesignPending } = useGlobalDesign();
  const {
    isCreating,
    Categorys,
    uploadCSV,
    deletingCategory,
    Exhibitors = [],
    searchText,
  } = useSelector((state: RootState) => state.ExhibitorSlice);
  const { responseModal, responseData } = useSelector(
    (state: RootState) => state.model,
  );

  const { downloadExhibitor, isdownloadPending } = useExhibitorsDownload();
  const { DeleteCategory, isDeleteCategoryPending } = useDeleteCategory();
  const { UploadSplash, isPending: isUploadSplashPending } = useUploadSplash();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const OnSave = () => {
    const formData = new FormData();
    if (Object.keys(splashValue).length === 0 && !splashValue.file_path) return;
    formData.append("file_path", splashValue.file_path as string);
    formData.append("title", splashValue.title);
    formData.append("subtitle", splashValue.subtitle);

    UploadSplash({
      form: formData,
    });
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSplashValue((pre) => ({
      ...pre,
      image: url,
    }));

    const res = await apiRequest(
      "post",
      `/upload/presigned-url?file_name=${file.name}&module=${"exhibitor_splash"}`,
    );

    const { file_key, upload_url } = res.response.response;

    setSplashValue((pre) => ({
      ...pre,
      file_path: file_key,
    }));

    await axios.put(upload_url, file, {
      headers: {
        "Content-Type": file.type,
      },
      responseType: "blob",
    });
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null) return;

    const updated = [...categories];

    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);

    updated.splice(dropIndex, 0, draggedItem);

    const finalData = updated.map((item, index) => ({
      ...item,
      seq: index + 1,
    }));

    setCategories(finalData);
    changeExhibitorSeq(finalData.map(pre=>pre.id))

    setDragIndex(null);
  };

  useEffect(() => {
    const newState = Categorys.reduce(
      (acc, p) => {
        acc[p.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    dispatch(setIsEditable(newState));
  }, [Categorys]);

  useEffect(() => {
    if (!GlobalDesign?.response) return;
    const splash = GlobalDesign.response.exhibitor_splash;
    if (!splash) return;
    setSplashValue(splash);
  }, [GlobalDesign]);

  useEffect(() => {
    if (Category?.response) {
      setCategories(
        Category.response
          .filter((pre) => Boolean(pre.type))
          .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0)),
      );
    }
  }, [Category]);

  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { GeneralExhibitorsUpdate, isGeneralExhibitorsUpdatePending } =
    useGeneralExhibitorsUpdate();

  if (isPending || isCategoryPending || isGlobalDesignPending) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Please wait data is loading...
        </p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <ErrorDisplay title="News Feed Error" message={error.message} />
  //     </div>
  //   );
  // }

  // if (!SettingValue || !SettingValue.response) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <NoData />
  //     </div>
  //   );
  // }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Exhibitor Design"
          onSave={() => GeneralExhibitorsUpdate()}
          show={false}
          loading={isGeneralExhibitorsUpdatePending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <div className="w-[15vw] flex items-center bg-white border border-gray-300 rounded-md gap-1">
              <input
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                type="text"
                className="outline-0 py-1 px-2"
                placeholder="Search Exhibitors"
              />
              {searchText && searchText.trim() && (
                <X
                  className="cursor-pointer"
                  size={20}
                  onClick={() => dispatch(setSearchText(""))}
                />
              )}
            </div>
            {Exhibitors.length > 0 && (
              <Button
                onClick={() => downloadExhibitor()}
                disabled={isdownloadPending}
                className="w-fit py-1 h-7 bg-green-50/50 border border-green-700 text-green-700 hover:text-white"
                title="Download Exhibitor Data"
              >
                <Download />
              </Button>
            )}
            <Button
              onClick={() => dispatch(setUploadCSV(true))}
              className="w-fit py-1 h-7 bg-green-50/50 border border-green-700 text-green-700 hover:text-white"
              title="Upload Exhibitor Data"
            >
              <Upload />
            </Button>
            <Button
              onClick={() => dispatch(setIsCreating(true))}
              className="w-fit py-1 h-7"
            >
              <Plus />
              Add Exhibitor
            </Button>
          </div>
        )}
        <Tabs defaultValue={value} onValueChange={setValue} className="">
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
              value={"Session Data"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              Exhibitor Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <div className="flex gap-4 items-start">
              <div className="w-full">
                <Section
                  title="Basic info"
                  ClassName="w-full"
                  onSave={() => GeneralExhibitorsUpdate()}
                  show={true}
                  loading={isGeneralExhibitorsUpdatePending}
                >
                  <TextStyleRow
                    label={"Tab Title"}
                    value={SpeakerSettings.exhibitors_tab}
                    onChange={(e) =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          exhibitors_tab: e,
                        }),
                      )
                    }
                    containerClassname="mb-8 w-[25rem]"
                  />
                  <div>
                    <div className="flex items-center py-2">
                      <div className="w-40 text-sm font-medium mr-8">
                        {"Open links in new tab"}
                      </div>
                      <ToggleSwitch
                        disable={true}
                        isOpen={
                          SpeakerSettings.exhibitor_settings.open_link_new_tab
                        }
                        setIsOn={() =>
                          dispatch(
                            setSpeakerSettings({
                              ...SpeakerSettings,
                              exhibitor_settings: {
                                ...SpeakerSettings.exhibitor_settings,
                                open_link_new_tab:
                                  !SpeakerSettings.exhibitor_settings
                                    .open_link_new_tab,
                              },
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-40 text-sm font-medium mr-8">
                        {"Allow email exposure"}
                      </div>
                      <ToggleSwitch
                        isOpen={
                          SpeakerSettings.exhibitor_settings
                            .allow_email_exposure
                        }
                        setIsOn={() =>
                          dispatch(
                            setSpeakerSettings({
                              ...SpeakerSettings,
                              exhibitor_settings: {
                                ...SpeakerSettings.exhibitor_settings,
                                allow_email_exposure:
                                  !SpeakerSettings.exhibitor_settings
                                    .allow_email_exposure,
                              },
                            }),
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-40 text-sm font-medium mr-8">
                        {"Booth Location Required"}
                      </div>
                      <ToggleSwitch
                        disable={true}
                        isOpen={
                          SpeakerSettings.exhibitor_settings.booth_location
                        }
                        setIsOn={() =>
                          dispatch(
                            setSpeakerSettings({
                              ...SpeakerSettings,
                              exhibitor_settings: {
                                ...SpeakerSettings.exhibitor_settings,
                                booth_location:
                                  !SpeakerSettings.exhibitor_settings
                                    .booth_location,
                              },
                            }),
                          )
                        }
                      />
                    </div>
                  </div>
                </Section>
                <Section
                  title="Splash Screen"
                  ClassName="w-full"
                  onSave={() => OnSave()}
                  show={true}
                  loading={isUploadSplashPending}
                >
                  <TextStyleRow
                    label={"Title"}
                    value={
                      splashValue.title && splashValue.title.trim()
                        ? splashValue.title
                        : ""
                    }
                    onChange={(e) =>
                      setSplashValue((pre) => ({ ...pre, title: e }))
                    }
                  />
                  <TextStyleRow
                    label={"Subtitle"}
                    value={
                      splashValue.subtitle && splashValue.subtitle.trim()
                        ? splashValue.subtitle
                        : ""
                    }
                    onChange={(e) =>
                      setSplashValue((pre) => ({ ...pre, subtitle: e }))
                    }
                  />
                  <div className="flex items-start gap-4 py-2">
                    <div className="text-sm font-medium w-[220px] shrink-0">
                      Background Image
                    </div>
                    <input
                      type="file"
                      multiple={false}
                      accept={"image/*"}
                      onChange={onChange}
                      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {GlobalDesign &&
                      GlobalDesign?.response?.exhibitor_splash?.image && (
                        <img
                          src={
                            typeof splashValue.image === "string"
                              ? (splashValue.image as string)
                              : URL.createObjectURL(splashValue.image as File)
                          }
                          alt=""
                          className="w-40 rounded-lg"
                        />
                      )}
                  </div>
                </Section>
              </div>
              <Section
                title="Exhibitor Categories & Order"
                ClassName="w-full"
                onSave={() => {}}
                show={false}
                loading={false}
              >
                <div className="">
                  {categories.map((data, index) => (
                      <div
                        key={data.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(index)}
                        className="flex items-center"
                      >
                        <GripVertical className="cursor-move"/>
                        <Custom_Text_Row
                          type={data.type}
                          id={data.id}
                          index={String(index + 1)}
                          seq={data.seq ?? index + 1}
                          value={data.name}
                          color={data.color}
                          allow_Image={data.allow_image}
                          assest
                        />
                      </div>
                    ))}
                  <Button
                    onClick={() => dispatch(setCategoryModal(true))}
                    className="mt-4"
                    variant={"link"}
                  >
                    + Add exhibitor category
                  </Button>
                </div>
              </Section>
            </div>
          </TabsContent>
          <TabsContent value="Session Data">
            <CustomTable />
          </TabsContent>
        </Tabs>
      </div>
      <CreateModal
        isOpen={isCreating}
        onClose={() => dispatch(setIsCreating(false))}
      />
      <AddCategoryModel />
      <CSVModel
        CSV_MODULE="exhibitor_csv"
        isOpen={uploadCSV}
        onClose={() => dispatch(setUploadCSV(false))}
        title="Exhibitors"
        isLoading={isUploadPending}
        onSubmit={UploadExhibitorsCSV}
        description="Upload CSV file to create Exhibitor entries. CSV Columns: full_name, url, email, category, ads"
        path="/exhibitors_listing.csv"
        ImageDescription="Upload a ZIP file containing images for Exhibitors entries. The image file names should match the corresponding Images IDs."
        type={2}
      />
      {responseModal && (
        <ErrorModal
          isOpen={responseModal}
          onClose={() => dispatch(setResponseModal(false))}
          data={responseData}
        />
      )}
      <DeleteModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => dispatch(setDeletingCategory(null))}
        onConfirm={() => DeleteCategory({ id: deletingCategory as string })}
        isDeleting={isDeleteCategoryPending}
      />
    </div>
  );
};

export default ExhibitorsDesign_page;
