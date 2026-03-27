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
import TextEditor from "@/v2_components/global/TextEditor";
import { Link } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VenueDesign_page = () => {
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { VenueActiveTab } = useSelector(
    (state: RootState) => state.ExtraSlice,
  );

  const { isPending } = useGetSpeakerSetting();

  const { UpdateVenueDesign, isUpdateVenueDesignPending } =
    useVenueDesignUpdate();
  const dispatch = useDispatch<AppDispatch>();

  const onAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(
      setSpeakerSettings({
        ...SpeakerSettings,
        venue: {
          ...SpeakerSettings.venue,
          attachment: file,
        },
      }),
    );
  };

  console.log(SpeakerSettings.venue.attachment)

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
        <Tabs value={VenueActiveTab} onValueChange={(e)=>dispatch(setVenueActiveTab(e))} className="">
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
                ClassName="w-full"
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
                <div className={cn("flex items-center gap-4 py-2 w-full")}>
                  <div className="text-sm font-[500] w-[220px] shrink-0">
                    {normalizeLabel("Attachment")}
                  </div>
                  <div className="flex items-center space-x-8">
                    <input
                      type="file"
                      multiple={false}
                      onChange={onAttachmentChange}
                      accept={"application/pdf"}
                      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/40"
                    />
                  </div>
                  {SpeakerSettings.venue.attachment && (
                    <a
                      href={
                        typeof SpeakerSettings.venue.attachment === "string"
                          ? SpeakerSettings.venue.attachment
                          : URL.createObjectURL(
                              SpeakerSettings.venue.attachment,
                            )
                      }
                      target="_blank"
                      className="flex items-center text-primary gap-1"
                    >
                      <Link size={18} /> Floor Plan
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4 py-2 w-full">
                  <div className="text-sm font-[500] w-[220px] shrink-0">
                    Image
                  </div>
                  <input
                    type="file"
                    multiple={false}
                    accept={"image/*"}
                    onChange={(e) => {
                      dispatch(
                        setSpeakerSettings({
                          ...SpeakerSettings,
                          venue: {
                            ...SpeakerSettings.venue,
                            image: e.target.files?.[0] as File,
                          },
                        }),
                      );
                    }}
                    className="text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary hover:file:bg-primary/40"
                  />
                  {SpeakerSettings.venue.image && (
                    <img
                      src={
                        typeof SpeakerSettings.venue.image === "string"
                          ? SpeakerSettings.venue.image
                          : URL.createObjectURL(
                              SpeakerSettings.venue.image as File,
                            )
                      }
                      alt=""
                      className="w-24 rounded-lg"
                    />
                  )}
                </div>
              </Section>
              <Section
                title={normalizeLabel("getting_there_description")}
                ClassName="w-full"
                onSave={() => UpdateVenueDesign()}
                show={true}
                loading={isUpdateVenueDesignPending}
              >
                <div className={cn("flex items-start gap-4 py-2")}>
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
