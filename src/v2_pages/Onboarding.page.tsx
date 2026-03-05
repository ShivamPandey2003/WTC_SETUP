import type { RootState } from "@/redux/store";
import OnboardingForm from "@/v2_components/common/V2_Onboarding/OnboardingForm";
import { useSelector } from "react-redux";

const Onboarding_page = () => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="rounded-lg relative w-full sm:max-w-2xl p-8 bg-white min-h-[60vh] h-fit shadow border border-gray-200 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <img
            src={appConfig?.logo?.logo_img}
            className="w-28 h-16 object-contain"
          />
        </div>
        <div className="mt-2">
          <h2 className="font-bold font-sans text-2xl text-center">
            Complete your profile
          </h2>
          <p className="text-gray-700 text-center">
            Tell us a bit about yourself
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
};

export default Onboarding_page;
