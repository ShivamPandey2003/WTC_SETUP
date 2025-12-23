import {
  useAppConfigUpdate,
  useGlobalDesign,
} from "@/api/global_api/global_api";
import ColorPicker from "@/components/common/Global_Design/ColorPicker";
import LogoUpload from "@/components/common/Global_Design/LogoUpload";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { normalizeLabel } from "@/lib/utils";
import { setAppConfig } from "@/redux/GlobalDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const GlobalDesign_page = () => {
  const { GlobalDesign, isGlobalDesignPending, error } = useGlobalDesign();
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const { updateAppConfig, isUpdateAppConfigPending } = useAppConfigUpdate();

  if (isGlobalDesignPending) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Loader className="text-primary animate-spin" size={30} />
        <p className="text-primary font-semibold text-lg">
          Please wait data is loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorDisplay title="News Feed Error" message={error.message} />
      </div>
    );
  }

  if (!GlobalDesign || !GlobalDesign.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar
          Title="Global Design"
          onSave={() => updateAppConfig()}
          loading={isUpdateAppConfigPending}
        />
        <Section title="Color Scheme" ClassName="w-full">
          {Object.entries(appConfig.color_schema).map(([key, value], i) => (
            <ColorPicker
              key={i}
              label={normalizeLabel(key)}
              color={value}
              description="The primary color is used in bold titles, default selection buttons and everywhere where user's attention has to be brought in."
              onChange={(e) =>
                dispatch(
                  setAppConfig({
                    ...appConfig,
                    color_schema: { ...appConfig.color_schema, [key]: e },
                  })
                )
              }
            />
          ))}
        </Section>
        <div className="flex gap-4">
          <Section title="Logo" ClassName="w-1/2">
            <div className="flex justify-between mx-[2rem]">
              <LogoUpload
                logoUrl={`data:image/png;base64,${appConfig.logo.logo_img}`}
                fileName={appConfig.logo.name}
              />
              <LogoUpload
                logoUrl={`data:image/png;base64,${appConfig.sponsors.logo}`}
                fileName={"Sponsor_Logo"}
                type={0}
                title="Sponsor Logo"
              />
            </div>
          </Section>
          <Section title="Text and styles" ClassName="w-1/2">
            {Object.entries(appConfig.text_style).map(([key, value], i) => (
              <TextStyleRow
                key={i}
                label={normalizeLabel(key)}
                value={value}
                onChange={(e) =>
                  dispatch(
                    setAppConfig({
                      ...appConfig,
                      text_style: { ...appConfig.text_style, [key]: e },
                    })
                  )
                }
              />
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

export default GlobalDesign_page;
