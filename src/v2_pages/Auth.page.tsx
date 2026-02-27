import type { RootState } from "@/redux/store";
import FormLayout from "@/v2_components/common/V2_Auth/FormLayout";
import OtpForm from "@/v2_components/common/V2_Auth/OtpForm";
import { useSelector } from "react-redux";

const Auth_page = () => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const { step } = useSelector((state: RootState) => state.AuthSlice);

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="rounded-lg relative w-full sm:max-w-2xl p-8 bg-white min-h-[60vh] h-fit shadow border border-gray-200 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <img
            src={appConfig?.logo?.logo_img}
            className="w-28 h-16 object-contain"
          />
        </div>
        {step === "email" ? <FormLayout /> : <OtpForm />}
      </div>
    </div>
  );
};

export default Auth_page;
