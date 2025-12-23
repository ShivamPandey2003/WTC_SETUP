import V2Sidebar from "@/data/V2Sidebar";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface prop {
  setOpen?: () => void;
}

export const V2_Sidebar_Context = ({ setOpen }: prop) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {appConfig} = useSelector((state:RootState)=>state.Global_DesignSlice);

  return (
    <>
      <div
        className="absolute top-2 cursor-pointer"
        onClick={() => navigate("/home_v2")}
      >
        <img src={`data:image/png;base64,${appConfig.logo.logo_img}`} className="w-[128px] h-[68px] object-contain" />
        <span className="text-[10px] font-bold">Sponsored by</span>
        <img src={`data:image/png;base64,${appConfig.sponsors.logo}`} className="w-[128px] h-[40px] object-contain" />
      </div>
      <div className="mx-auto flex flex-col space-y-4">
        {V2Sidebar.map((item) => (
          <Button
            key={item.route}
            className={cn(
              "bg-white text-balck hover:bg-[#35825C] hover:text-white cursor-pointer",
              pathname === item.route && "bg-[#35825C] text-white"
            )}
            onClick={() => {
              navigate(item.route);
              setOpen?.();
            }}
          >
            <item.Icon />
            {item.title}
          </Button>
        ))}
      </div>
    </>
  );
};

const V2_Sidebar = () => {
  return (
    <aside className="hidden p-4 sm:flex items-center relative border-r border-border shadow">
      <V2_Sidebar_Context />
    </aside>
  );
};

export default V2_Sidebar;
