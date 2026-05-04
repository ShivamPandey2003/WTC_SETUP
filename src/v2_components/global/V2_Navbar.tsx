import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { setSearchModal, setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { ChevronLeft, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { SearchTrigger } from "./SearchTrigger";
import NewDropdown from "./V2_DropDown";
import { setUserInfo } from "@/redux/AuthSlice";
import { useGetProfile } from "@/api/Profile_api/Profile_api";
import { Skeleton } from "@/components/ui/skeleton";

interface Prop {
  REF: any;
  setOpen: () => void;
}

const V2_Navbar = ({ REF, setOpen }: Prop) => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const { Profile } = useGetProfile();
  const { pathname, state } = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { grp } = useSelector((state: RootState) => state.AuthSlice.userinfo);
  const { News } = useSelector((state: RootState) => state.ExtraSlice);
  const { speakers } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { showSearch } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const menu = [
    ...(grp === 1
      ? [
        {
          id: "Dashboard",
          label: "Admin Module",
          onClick: () => {
            navigate("/global-design");
            dispatch(setTitle(null));
          },
        },
      ]
      : []),
    {
      id: "Profile",
      label: "Profile",
      onClick: () => {
        dispatch(setTitle(null));
        navigate(grp === 1 ? "/wtc-profile" : "/user-profile", {state:{Title:"User Profile"}});
      },
    },
    {
      id: "Logout",
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        dispatch(
          setUserInfo({ firstname: "", lastname: "", grp: 0, is_verified: 0 }),
        );
        navigate("/auth");
      },
    },
  ];
  const { ArrayTabs } = useSelector((state: RootState) => state.Global_Slice);

  useEffect(() => {
    const el = REF?.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop >= 33) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const TitleFetch = (e: string) => {
    switch (e) {
      case "programme":
        return ArrayTabs.programme_tab;
      case "speaker":
        return ArrayTabs.speaker_tab;
      case "venue":
        return ArrayTabs.venue_tab;
      case "exhibitors":
        return ArrayTabs.exhibitors_tab;
      case "news":
        return ArrayTabs.home_tab;
      case "":
        return "News";
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-99 bg-[#F2F2F2] flex items-center justify-between p-2 pl-4 pr-4 transition-colors duration-200 gap-x-2 ",
        showBackground && "bg-[#F2F2F2] shadow",
      )}
    >
      <div className="flex items-center gap-4">
        <Menu className="sm:hidden cursor-pointer" onClick={setOpen} />
        {id && (
          <ChevronLeft
            className="cursor-pointer hover:text-primary"
            onClick={() => {
              navigate(-1);
              dispatch(setTitle(null));
            }}
          />
        )}
        {state ? (
          <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize text-ellipsis whitespace-nowrap overflow-hidden sm:max-w-[300px] md:max-w-[600px]">
            {state.Title}
          </h2>
        ) : (
          <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize text-ellipsis whitespace-nowrap overflow-hidden sm:max-w-[300px] md:max-w-[600px]">
            {TitleFetch(pathname.split("/")[1])}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-4">
        {((pathname === "/" && News.length > 0) ||
          (pathname === "/speaker" && speakers.length > 0) ||
          (pathname === "/exhibitors" && showSearch)) && (
            <SearchTrigger onClick={() => dispatch(setSearchModal(true))} tabname={TitleFetch(pathname.split("/")[1]) as string} />
          )}
        {!token ? (
          <Button
            onClick={() => navigate("/auth")}
            className="px-8 py-4 rounded-full bg-primary cursor-pointer"
          >
            Login
          </Button>
        ) : (
          <NewDropdown
            className=""
            position="bottom-right"
            trigger={
              Profile && Profile?.response?.user_info ? (
                <button className="p-2 flex items-center gap-3 text-sm hover:bg-primary/50 transition-colors border-t border-white/20 cursor-pointer w-10 h-10 rounded-full bg-primary">
                  <span className="text-sm font-bold text-white w-full">
                    {`${Profile?.response?.user_info.firstname[0]}${Profile?.response?.user_info.lastname[0]}`}
                  </span>
                </button>
              )
              :
              <Skeleton className="w-10 h-10 rounded-full" />
            }
            items={menu as any[]}
          />
        )}
      </div>
    </header>
  );
};

{
  /* grp !== 1 ? (
          <Button
            onClick={() => {
              navigate("/user-profile");
              dispatch(setTitle(null));
            }}
            className="px-8 py-4 rounded-full bg-[#318061] cursor-pointer"
          >
            Go to Profile
          </Button>
        ) : (
          <Button
            onClick={() => {
              navigate("/global-design");
              dispatch(setTitle(null));
            }}
            className="px-6 sm:px-8 py-4 rounded-full bg-[#318061] cursor-pointer"
          >
            dashboard
          </Button>
        )} */
}

export default V2_Navbar;
