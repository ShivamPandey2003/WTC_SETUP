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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] backdrop-blur-[2px]"
      onClick={handleClick}
    >
      <div
        className="w-[40rem] h-[40rem] bg-cover bg-center relative rounded-2xl"
        style={{
          backgroundImage: `data:image/png;base64,${appConfig.splash.image}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex flex-col justify-end py-4 px-8 md:px-16 rounded-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            {appConfig.splash.title}
          </h1>
          {/* <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {appConfig.splash.title.split(" ").join(" ")}
          </h2> */}
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {appConfig.splash.subtitle}
          </p>
          <button className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-8 py-3 rounded-full w-fit transition-colors duration-200">
            More info
          </button>
        </div>
        <X
          className=" absolute right-4 top-4 cursor-pointer text-white hover:text-slate-200"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default V2_SplashScreen;
