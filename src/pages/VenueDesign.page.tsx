import { useVenueDesignUpdate } from "@/api/global_api/global_api";
import { useGetSpeakerSetting } from "@/api/speaker_design_api/speaker_design_api";
import Floor_Plan from "@/components/common/Venue_Design/Floor_Plan";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn, normalizeLabel } from "@/lib/utils";
import { setVenueActiveTab } from "@/redux/ExtraSlice";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";
import TextEditor from "@/v2_components/global/TextEditor";
import axios from "axios";
import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VenueDesign_page = () => {
  const { isPending, SpeakerSettings: Data } = useGetSpeakerSetting();
  const [venueImage, setVenueImage] = useState<string | null>(null);
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { VenueActiveTab } = useSelector(
    (state: RootState) => state.ExtraSlice,
  );
  const [url, setUrl] = useState<string>("");

  const { UpdateVenueDesign, isUpdateVenueDesignPending } =
    useVenueDesignUpdate();
  const dispatch = useDispatch<AppDispatch>();

  const onAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUrl(url);

    const res = await apiRequest(
      "post",
      `/upload/presigned-url?file_name=${file.name}&module=${"venue_attachment"}`,
    );

    const { file_key, upload_url } = res.response.response;
    await axios.put(upload_url, file, {
      headers: {
        "Content-Type": file.type,
      },
      responseType: "blob",
    });

    const newForm = new FormData();
    newForm.append("file_path_attachment", file_key);
    apiRequest("post", "/venue/upload-files", newForm);

    dispatch(
      setSpeakerSettings({
        ...SpeakerSettings,
        venue: {
          ...SpeakerSettings.venue,
          attachment: file_key,
        },
      }),
    );
  };

  useEffect(() => {
    if (Data && Data.response.venue) {
      if (Data.response.venue.attachment) {
        setUrl(Data.response.venue.attachment as string);
      }
      if (Data.response.venue.image) {
        setVenueImage(Data.response.venue.image as string);
      }
    }
  }, [Data]);

  if (isPending) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Venue Design"
          onSave={() => UpdateVenueDesign()}
          show={false}
          loading={isUpdateVenueDesignPending}
        />
        <Tabs
          value={VenueActiveTab}
          onValueChange={(e) => dispatch(setVenueActiveTab(e))}
          className=""
        >
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
              value={"Floor Plan"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              Floor Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <div className="flex items-start gap-4">
              <Section
                title="Basic info"
                ClassName="w-full h-[calc(100vh-180px)] overflow-auto"
                onSave={() => UpdateVenueDesign()}
                show={true}
                loading={isUpdateVenueDesignPending}
              >
                <TextStyleRow
                  label={"Tab Title"}
                  value={SpeakerSettings.venue_tab}
                  onChange={(e) =>
                    dispatch(
                      setSpeakerSettings({
                        ...SpeakerSettings,
                        venue_tab: e,
                      }),
                    )
                  }
                  containerClassname="mb-4"
                />
                <TextStyleRow
                  label={normalizeLabel("getting_there_sub_title")}
                  value={SpeakerSettings.venue.getting_there_sub_title}
                  onChange={(e) =>
                    dispatch(
                      setSpeakerSettings({
                        ...SpeakerSettings,
                        venue: {
                          ...SpeakerSettings.venue,
                          getting_there_sub_title: e,
                        },
                      }),
                    )
                  }
                  containerClassname="mb-4"
                />
                <TextStyleRow
                  label={normalizeLabel("latitude")}
                  value={SpeakerSettings.venue.latitude}
                  onChange={(e) =>
                    dispatch(
                      setSpeakerSettings({
                        ...SpeakerSettings,
                        venue: {
                          ...SpeakerSettings.venue,
                          latitude: e,
                        },
                      }),
                    )
                  }
                  containerClassname="mb-4"
                />
                <TextStyleRow
                  label={normalizeLabel("longitude")}
                  value={SpeakerSettings.venue.longitude}
                  onChange={(e) =>
                    dispatch(
                      setSpeakerSettings({
                        ...SpeakerSettings,
                        venue: {
                          ...SpeakerSettings.venue,
                          longitude: e,
                        },
                      }),
                    )
                  }
                  containerClassname="mb-4"
                />
               
                {/* Two Column Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 w-full border-t border-gray-100">

                  {/* Column 1: Attachment */}
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-[500] text-gray-900">
                      {normalizeLabel("Attachment")}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        multiple={false}
                        onChange={onAttachmentChange}
                        accept={"application/pdf"}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/40"
                      />

                      {/* PDF Link Box */}
                      <div className="mt-2 w-full max-w-[200px] aspect-video rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center w-full h-full gap-2 text-primary hover:bg-primary/5 transition-colors"
                          >
                            <Link size={24} />
                            <span className="text-sm font-medium">View Floor Plan (PDF)</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No attachment uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Image Preview */}
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-[500] text-gray-900">
                      Image
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        multiple={false}
                        accept={"image/*"}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const url = URL.createObjectURL(file);
                          setVenueImage(url);

                          const res = await apiRequest(
                            "post",
                            `/upload/presigned-url?file_name=${file.name}&module=${"venue_image"}`,
                          );

                          const { file_key, upload_url } = res.response.response;
                          await axios.put(upload_url, file, {
                            headers: {
                              "Content-Type": file.type,
                            },
                            responseType: "blob",
                          });

                          const newForm = new FormData();
                          newForm.append("file_path_image", file_key);
                          apiRequest("post", "/venue/upload-files", newForm);
                          
                          dispatch(
                            setSpeakerSettings({
                              ...SpeakerSettings,
                              venue: {
                                ...SpeakerSettings.venue,
                                image: file_key,
                              },
                            }),
                          );
                        }}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/40"
                      />

                      {/* Image Box */}
                      <div className="mt-2 w-full max-w-[200px] aspect-video rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {venueImage ? (
                          <img
                            src={venueImage}
                            alt="Venue"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400 italic">No image uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
              <Section
                title={normalizeLabel("getting_there_description")}
                ClassName="w-full h-[calc(100vh-180px)] overflow-auto"
                onSave={() => UpdateVenueDesign()}
                show={true}
                loading={isUpdateVenueDesignPending}
              >
                <div className={cn("flex items-start gap-4 py-2 w-full")}>
                  <TextEditor
                    initialHtml={
                      SpeakerSettings.venue.getting_there_description
                    }
                    save={(e) =>
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          venue: {
                            ...SpeakerSettings.venue,
                            getting_there_description: e,
                          },
                        }),
                      )
                    }
                  />
                </div>
              </Section>
            </div>
          </TabsContent>
          <TabsContent value="Floor Plan">
            <Floor_Plan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VenueDesign_page;
