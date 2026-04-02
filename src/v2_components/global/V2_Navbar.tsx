import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { setSearchModal, setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { ChevronLeft, Menu } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { SearchTrigger } from "./SearchTrigger";
import NewDropdown from "./V2_DropDown";
import { setUserInfo } from "@/redux/AuthSlice";
import { useGetProfile } from "@/api/Profile_api/Profile_api";

interface Prop {
  REF: RefObject<HTMLDivElement | null>;
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
  const { Exhibitors } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );
  const menu = [
    ...(grp === 1
      ? [
          {
            id: "Dashboard",
            label: "Dashboard",
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
        navigate(grp === 1 ? "/wtc-profile" : "/user-profile");
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
  const { title } = useSelector((state: RootState) => state.model);

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
        return ArrayTabs.home_tab;
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-[999] flex items-center justify-between p-4 transition-colors duration-200",
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
          <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize text-ellipsis whitespace-nowrap overflow-hidden max-w-[100px] sm:max-w-[300px] md:max-w-[600px]">
            {state.Title}
          </h2>
        ) : (
          <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize text-ellipsis whitespace-nowrap overflow-hidden max-w-[100px] sm:max-w-[300px] md:max-w-[600px]">
            {TitleFetch(pathname.split("/")[1])}{title ? ` / ${title}` : ""}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-4">
        {((pathname === "/" && News.length > 0) ||
          (pathname === "/speaker" && speakers.length > 0) ||
          (pathname === "/exhibitors" && Exhibitors.length > 0)) && (
          <SearchTrigger onClick={() => dispatch(setSearchModal(true))} />
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
              <button className="p-2 flex items-center gap-3 text-sm hover:bg-primary/50 transition-colors border-t border-white/20 cursor-pointer rounded-full bg-primary">
                {Profile && (
                  <span className="text-sm font-bold text-white">{`${Profile?.response?.user_info.firstname[0]} ${Profile?.response?.user_info.lastname[0]}`}</span>
                )}
              </button>
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
