import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { setLoginModel, setSearchModal, setTitle } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { ChevronLeft, Menu } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { SearchTrigger } from "./SearchTrigger";

interface Prop {
  REF: RefObject<HTMLDivElement | null>;
  setOpen: () => void;
}

const V2_Navbar = ({ REF, setOpen }: Prop) => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const { grp } = useSelector((state: RootState) => state.AuthSlice.userinfo);
  const navigate = useNavigate();
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
        <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize">
          {TitleFetch(pathname.split("/")[1])} {title ? `/ ${title}` : ""}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {(pathname === "/" ||
          pathname === "/speaker" ||
          pathname === "/exhibitors") && (
          <SearchTrigger onClick={() => dispatch(setSearchModal(true))} />
        )}
        {!token ? (
          <Button
            onClick={() => dispatch(setLoginModel(true))}
            className="px-8 py-4 rounded-full bg-[#318061] cursor-pointer"
          >
            Login
          </Button>
        ) : grp !== 1 ? (
          <Button
            onClick={() => navigate("/user-profile")}
            className="px-8 py-4 rounded-full bg-[#318061] cursor-pointer"
          >
            Go to Profile
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/global-design")}
            className="px-8 py-4 rounded-full bg-[#318061] cursor-pointer"
          >
            Go to dashboard
          </Button>
        )}
      </div>
    </header>
  );
};

export default V2_Navbar;
