import LoginModal from "@/components/global/LoginModal";
import Navbar from "@/components/global/Navbar";
import { setLoginModel } from "@/redux/ModalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { loginModel } = useSelector((state: RootState) => state.model);
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div>
      <Navbar />
      <Outlet />
      <LoginModal isOpen={loginModel} onClose={()=>dispatch(setLoginModel(false))} />
    </div>
  );
};

export default RootLayout;
