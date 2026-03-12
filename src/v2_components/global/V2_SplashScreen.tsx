import type { RootState } from "@/redux/store";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

interface V2_SplashScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const V2_SplashScreen = ({ open, setOpen }: V2_SplashScreenProps) => {
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLOrSVGElement>,
  ) => {
    e.stopPropagation();
    setOpen(false);
  };

  if (!open || !appConfig.show_splash) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-999 backdrop-blur-[2px]"
      onClick={handleClick}
    >
      <div
        className="relative rounded-2xl overflow-hidden max-w-[728px] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={appConfig.splash.image}
          alt="Splash Screen"
          className="w-full h-full object-cover"
        />
        <X
          className="absolute right-4 top-4 cursor-pointer text-white hover:text-slate-200"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default V2_SplashScreen;
