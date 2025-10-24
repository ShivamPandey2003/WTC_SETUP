import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Navroutes from "@/data/Navroutes";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setLoginModel } from "@/redux/ModalSlice";

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>()

  return (
    <nav className="w-full">
      <div className="fixed top-0 w-full flex justify-between items-center py-2 z-[999] bg-background px-[7.5%]">
        <img src="./Logo.png" className="w-[122px] h-[67px]" />
        <div className="hidden lg:flex items-center justify-between w-[690px] gap-2">
          {Navroutes.map(({ Icon, title, route }) => (
            <Link
              key={route}
              to={route}
              className={cn(
                "flex gap-2 rounded-[5px] w-[150px] h-[32px] items-center justify-center cursor-pointer",
                pathname === route && "bg-button border-border border-[1px]"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "text-text",
                  pathname === route && "text-primary"
                )}
              />
              <span
                className={cn(
                  "font-[600] text-[14px] text-text",
                  pathname === route && "text-primary"
                )}
              >
                {title}
              </span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-bgCard border-[1px] border-border p-1 rounded-[5px] block md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu text-primary"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                className={cn("transition", isOpen && "opacity-0")}
              ></line>
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                className={cn(
                  "origin-left transition",
                  isOpen && "rotate-45 -translate-y-1"
                )}
              ></line>
              <line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
                className={cn(
                  "origin-left transition",
                  isOpen && "-rotate-45 translate-y-1"
                )}
              ></line>
            </svg>
          </div>
          <Button onClick={()=>dispatch(setLoginModel(true))} className="hidden sm:block px-[12px] py-[6px] w-[115px] h-[32px]">
            Log In
          </Button>
        </div>
      </div>
      <div className="pt-[6rem]">
        {isOpen && (
          <div className="h-auto transition-all duration-200 overflow-hidden bg-bgCard border-[1px] border-border rounded-[5px] p-4">
            <div className="flex flex-col items-center gap-4 py-2">
              {Navroutes.map(({ Icon, title, route }) => (
                <Link
                  to={route}
                  key={route}
                  className={cn(
                    "flex gap-2 rounded-[5px] w-[150px] h-[32px] items-center justify-center cursor-pointer",
                    pathname === route && "bg-button border-border border-[1px]"
                  )}
                >
                  <Icon
                    size={17}
                    className={cn(
                      "text-text",
                      pathname === route && "text-primary"
                    )}
                  />
                  <span
                    className={cn(
                      "font-[600] text-[14px] text-text",
                      pathname === route && "text-primary"
                    )}
                  >
                    {title}
                  </span>
                </Link>
              ))}
              <Button onClick={()=>dispatch(setLoginModel(true))} className="sm:hidden w-[150px] h-[32px]">Log In</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
