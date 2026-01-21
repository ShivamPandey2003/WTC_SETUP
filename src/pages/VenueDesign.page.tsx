import { useVenueDesignUpdate } from "@/api/global_api/global_api";
import Floor_Plan from "@/components/common/Venue_Design/Floor_Plan";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { normalizeLabel } from "@/lib/utils";
import { setSpeakerSettings } from "@/redux/SpeakerDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const VenueDesign_page = () => {
  const [value, setValue] = React.useState<string>("General Settings");
  const { SpeakerSettings } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const {UpdateVenueDesign, isUpdateVenueDesignPending} = useVenueDesignUpdate()
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6 relative">
        <AdminTitlebar
          Title="Venue Design"
          onSave={() => UpdateVenueDesign()}
          show={Boolean(value !== "Session Data")}
          loading={isUpdateVenueDesignPending}
        />
        {Boolean(value === "Session Data") && (
          <div className="absolute right-10 flex items-center gap-4">
            <Button onClick={() => {}} className="w-[100px] py-1 h-7">
              <Plus />
              Add New
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
              value={"Floor Plan"}
              className="text-[15px] font-semibold leading-[15px] px-0"
            >
              Floor Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="General Settings">
            <Section title="WIP" ClassName="w-full">
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
                value={SpeakerSettings.getting_there_sub_title}
                onChange={(e) =>
                  dispatch(
                    setSpeakerSettings({
                      ...SpeakerSettings,
                      getting_there_sub_title: e,
                    }),
                  )
                }
                containerClassname="mb-4"
              />
              <TextStyleRow
                label={normalizeLabel("getting_there_description")}
                value={SpeakerSettings.getting_there_description}
                onChange={(e) =>
                  dispatch(
                    setSpeakerSettings({
                      ...SpeakerSettings,
                      getting_there_description: e,
                    }),
                  )
                }
                containerClassname="mb-4"
              />
              <TextStyleRow
                label={normalizeLabel("latitude")}
                value={SpeakerSettings.latitude}
                onChange={(e) =>
                  dispatch(
                    setSpeakerSettings({
                      ...SpeakerSettings,
                      latitude: e,
                    }),
                  )
                }
                containerClassname="mb-4"
              />
              <TextStyleRow
                label={normalizeLabel("longitude")}
                value={SpeakerSettings.longitude}
                onChange={(e) =>
                  dispatch(
                    setSpeakerSettings({
                      ...SpeakerSettings,
                      longitude: e,
                    }),
                  )
                }
                containerClassname="mb-4"
              />
            </Section>
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
