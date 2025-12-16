import V2_LOGO from "@/assets/Images/V2_LOGO.png";
import V2Sidebar from "@/data/V2Sidebar";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface prop {
  setOpen?: () => void;
}

export const V2_Sidebar_Context = ({ setOpen }: prop) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <>
      <div
        className="absolute top-2 cursor-pointer"
        onClick={() => navigate("/home_v2")}
      >
        <img src={V2_LOGO} className="w-[128px] h-[68px]" />
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
