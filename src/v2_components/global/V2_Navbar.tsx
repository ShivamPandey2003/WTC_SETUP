import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router";

interface Prop {
  REF: RefObject<HTMLDivElement | null>;
  setOpen:()=>void
}

const V2_Navbar = ({ REF, setOpen }: Prop) => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const { pathname } = useLocation();

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

  return (
    <header
      className={cn(
        "sticky top-0 z-[999] flex items-center justify-between p-4 transition-colors duration-200",
        showBackground && "bg-[#F2F2F2] shadow"
      )}
    >
      <div className="flex items-center gap-4">
        <Menu className="sm:hidden cursor-pointer" onClick={setOpen}/>
        <h2 className="text-[26px] font-[600] text-[#575757] leading-[27px] capitalize">
          {pathname.split("_")[0].slice(1)}
        </h2>
      </div>
      <Button className="px-8 py-4 rounded-full cursor-pointer">Login</Button>
    </header>
  );
};

export default V2_Navbar;
