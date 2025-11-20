import LoginModal2 from "@/components/common/Auth/LoginModal";
// import LoginModal from "@/components/global/LoginModal";
import Navbar from "@/components/global/Navbar";
import { setEmail, setOtp, setStep } from "@/redux/AuthSlice";
import { setLoginModel } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { loginModel } = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch<AppDispatch>()

  const onClose = ()=>{
    dispatch(setLoginModel(false))
    dispatch(setStep("email"))
    dispatch(setEmail(""))
    dispatch(setOtp(["", "", "", "", "", ""]))
  }

  return (
    <div>
      <Navbar />
      <Outlet />
      <LoginModal2 isOpen={loginModel} onClose={()=>onClose()} />
    </div>
  );
};

export default RootLayout;
