import { cn } from "@/lib/utils";
import V2_Navbar from "@/v2_components/global/V2_Navbar";
import V2_Sidebar, {
  V2_Sidebar_Context,
} from "@/v2_components/global/V2_Sidebar";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Outlet } from "react-router";

const V2_rootlayout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-[#F2F2F2]">
      <V2_Sidebar />
      <div ref={scrollRef} className="w-full overflow-y-auto">
        <V2_Navbar REF={scrollRef} setOpen={() => setOpen(true)} />
        <Outlet />
      </div>
      <aside
        className={cn(
          "sm:hidden fixed top-0 left-0 h-full w-fit p-4 bg-[#92D5A1] z-[999]",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex h-full items-center">
          <div className=" absolute right-0 top-0 z-[999]">
            <X className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>
          <V2_Sidebar_Context setOpen={() => setOpen(false)} />
        </div>
      </aside>
    </div>
  );
};

export default V2_rootlayout;
