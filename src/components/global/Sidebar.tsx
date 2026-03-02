import { cn } from "@/lib/utils";
import { setUserInfo } from "@/redux/AuthSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import NewDropdown from "@/v2_components/global/V2_DropDown";
import {
  Globe,
  Home,
  CreditCard,
  User,
  UserRound,
  Navigation,
  Boxes,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = "global" }: SidebarProps) {
  const navigate = useNavigate();
  const {userinfo} = useSelector((state:RootState)=>state.AuthSlice)
  const dispatch = useDispatch<AppDispatch>()
  const menu = [
    {
      id: "Profile",
      label: "Admin Profile",
      onClick: () => navigate("/wtc-profile"),
    },
    {
      id: "Logout",
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token")
        dispatch(setUserInfo({firstname:"", lastname:"", grp:0, is_verified:0}))
        navigate('/')
      },
    },
  ];

  return (
    <aside className="w-[153px] bg-primary text-white h-screen flex flex-col">
      <div className="p-4 text-center border-b border-white/20">
        <h1 className="text-[20px] font-[600] leading-[15px]">WTC App</h1>
        <p className="text-[14px] font-[600]">Designer</p>
      </div>

      <nav className="flex-1 py-4 px-2">
        <button
          className={cn(
            `w-full px-4 py-2 mb-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "global"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/global-design")}
        >
          <Globe size={18} />
          <span>Global</span>
        </button>

        <button
          className={cn(
            `w-full px-4 py-2 mb-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "home"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/home-design")}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          className={cn(
            `w-full px-4 py-2 mb-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "programme"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/programme-design")}
        >
          <CreditCard size={18} />
          <span>Programme</span>
        </button>
        <button
          className={cn(
            `w-full px-4 py-2 mb-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "speakers"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/speakers-design")}
        >
          <UserRound size={18} />
          <span>Speakers</span>
        </button>
        <button
          className={cn(
            `w-full px-4 py-2 mb-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "venue"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/venue-design")}
        >
          <Navigation size={18} />
          <span>Venue</span>
        </button>
        <button
          className={cn(
            `w-full px-4 py-2 flex items-center gap-3 text-sm transition-colors rounded-[5px] cursor-pointer`,
            activeItem === "exhibitors"
              ? "bg-white text-[#318061]"
              : "hover:bg-white/10",
          )}
          onClick={() => navigate("/exhibitors-design")}
        >
          <Boxes size={18} />
          <span>Exhibitors</span>
        </button>
      </nav>

      <NewDropdown
        className="w-full"
        position="top"
        trigger={
          <button className="w-full p-4 flex items-center gap-3 text-sm hover:bg-white/10 transition-colors border-t border-white/20 cursor-pointer">
            <User size={18} />
            <span className="text-xs">{`${userinfo.firstname} ${userinfo.lastname}`}</span>
          </button>
        }
        items={menu}
      />
    </aside>
  );
}
