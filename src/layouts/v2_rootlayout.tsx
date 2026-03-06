import {
  useGetConferenceDetails,
  useGlobalDesign,
} from "@/api/global_api/global_api";
import { cn } from "@/lib/utils";
import V2_Navbar from "@/v2_components/global/V2_Navbar";
import LoginModal2 from "@/components/common/Auth/LoginModal";
import V2_Sidebar, {
  V2_Sidebar_Context,
} from "@/v2_components/global/V2_Sidebar";
import V2_SplashScreen from "@/v2_components/global/V2_SplashScreen";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setLoginModel, setSearchModal } from "@/redux/ModalSlice";
import { setEmail, setOtp, setStep } from "@/redux/AuthSlice";
import { SearchModal } from "@/v2_components/global/SearchModal";

const V2_rootlayout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [spashScreen, setSpashScreen] = useState<boolean>(false);
  const { loginModel, searchModal } = useSelector(
    (state: RootState) => state.model,
  );
  const dispatch = useDispatch<AppDispatch>();
  const {} = useGlobalDesign();
  const {} = useGetConferenceDetails();

  useEffect(() => {
    const isShowed = sessionStorage.getItem("App_Splash");
    if (!isShowed) {
      setSpashScreen(true);
      sessionStorage.setItem("App_Splash", JSON.stringify(true));
    }
    const timer = setTimeout(() => {
      setSpashScreen(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [setSpashScreen]);

  const onClose = () => {
    dispatch(setLoginModel(false));
    dispatch(setStep("email"));
    dispatch(setEmail(""));
    dispatch(setOtp(["", "", "", "", "", ""]));
  };

  return (
    <div className="flex h-screen bg-[#F2F2F2]">
      <V2_Sidebar />
      <div ref={scrollRef} className="w-full overflow-y-auto">
        <V2_Navbar REF={scrollRef} setOpen={() => setOpen(true)} />
        <Outlet />
      </div>
      <aside
        className={cn(
          "sm:hidden fixed top-0 left-0 h-full w-fit p-4 bg-gray-100 shadow z-[999]",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-full items-center">
          <div className=" absolute right-0 top-0 z-[999]">
            <X className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>
          <V2_Sidebar_Context setOpen={() => setOpen(false)} />
        </div>
      </aside>
      {searchModal && (
        <SearchModal
          isOpen={searchModal}
          onClose={() => dispatch(setSearchModal(false))}
        />
      )}
      <LoginModal2 isOpen={loginModel} onClose={() => onClose()} />
      <V2_SplashScreen open={spashScreen} setOpen={setSpashScreen} />
    </div>
  );
};

export default V2_rootlayout;
