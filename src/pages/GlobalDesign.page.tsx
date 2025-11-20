import {
  useAppConfigUpdate,
  useGlobalDesign,
} from "@/api/global_api/global_api";
import ColorPicker from "@/components/common/Global_Design/ColorPicker";
import LogoUpload from "@/components/common/Global_Design/LogoUpload";
import AdminTitlebar from "@/components/global/AdminTitlebar";
import Section from "@/components/global/Section";
import TextStyleRow from "@/components/global/TextStyleRow";
import { normalizeLabel } from "@/lib/utils";
import { setAppConfig } from "@/redux/GlobalDesignSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

const GlobalDesign_page = () => {
  const { GlobalDesign, isGlobalDesignPending } = useGlobalDesign();
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const { updateAppConfig, isUpdateAppConfigPending } = useAppConfigUpdate();

  if (isGlobalDesignPending || !GlobalDesign) {
    return;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto px-8 py-6">
        <AdminTitlebar
          Title="Global Design"
          onSave={() => updateAppConfig()}
          loading={isUpdateAppConfigPending}
        />
        <Section title="Color Scheme">
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
        <Section title="Logo">
          <LogoUpload
            logoUrl={`data:image/png;base64,${appConfig.logo.logo_img}`}
            fileName={appConfig.logo.name}
          />
        </Section>
        <Section title="Text and styles">
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
  );
};

export default GlobalDesign_page;
