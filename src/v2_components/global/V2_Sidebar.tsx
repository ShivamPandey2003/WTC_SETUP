import V2Sidebar from "@/data/V2Sidebar";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useGetTabs } from "@/api/global_api/global_api";
import { Skeleton } from "@/components/ui/skeleton";

interface prop {
  setOpen?: () => void;
}

export const V2_Sidebar_Context = ({ setOpen }: prop) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const { tabsData, isPending } = useGetTabs();

  return (
    <>
      <div
        className="absolute top-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={appConfig?.logo?.logo_img}
          className="w-[128px] h-[68px] object-contain"
        />
        <span className="text-[10px] font-bold">Sponsored by</span>
        <img
          src={appConfig?.sponsors?.logo}
          className="w-[128px] h-[40px] object-contain"
        />
      </div>
      <div className="mx-auto flex flex-col space-y-4">
        {isPending || !Object.keys(tabsData?.response ?? {}).length || !tabsData
          ? [1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="w-full mb-2 h-8" />
            ))
          : Object.entries(tabsData.response).map(([key, value]) => {
              const item = V2Sidebar.find((pre) => pre.title.includes(key));
              if (!item) return null;
              return (
                <Button
                  key={key}
                  className={cn(
                    "bg-white text-black hover:bg-[#35825C] hover:text-white cursor-pointer justify-start",
                    pathname === item.route && "bg-[#35825C] text-white",
                  )}
                  onClick={() => {
                    navigate(item.route);
                    setOpen?.();
                  }}
                >
                  <item.Icon />
                  <span className="max-w-[80px] line-clamp-1">{value}</span>
                </Button>
              );
            })}
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
