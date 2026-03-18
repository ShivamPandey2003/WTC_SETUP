import V2Sidebar from "@/data/V2Sidebar";
import { NavLink, useLocation, useNavigate } from "react-router";
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
        className="cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={appConfig?.logo?.logo_img}
          className="w-[128px] h-[68px] object-contain"
        />
        <span className="text-[10px] font-bold">Sponsored by</span>
        <img
          src={appConfig?.sponsors?.logo}
          className="w-[128px] object-cover"
        />
      </div>
      <div className="mx-auto flex flex-col space-y-4">
        {isPending || !Object.keys(tabsData?.response ?? {}).length || !tabsData
          ? [1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="w-full mb-2 h-8" />
            ))
          : Object.entries(tabsData.response).map(([key, value]) => {
              const item = V2Sidebar.find((pre) => pre.title.includes(key));
              const isHomeActive =
                item?.route === "/" && pathname.startsWith("/new");
              if (!item) return null;
              return (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    cn(
                      "text-black hover:bg-primary hover:text-white cursor-pointer inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive justify-start px-4 py-2 has-[>svg]:px-3",
                      (isActive || isHomeActive) ? "bg-primary text-white" : "bg-gray-100",
                    )
                  }
                  onClick={() => setOpen?.()}
                >
                  <item.Icon />
                  <span className="max-w-[80px] overflow-hidden text-ellipsis">{value}</span>
                </NavLink>
              );
            })}
      </div>
    </>
  );
};

const V2_Sidebar = () => {
  return (
    <aside className="hidden p-4 sm:flex flex-col gap-4 items-center bg-white relative border-r border-border shadow min-w-[150px]">
      <V2_Sidebar_Context />
    </aside>
  );
};

export default V2_Sidebar;
