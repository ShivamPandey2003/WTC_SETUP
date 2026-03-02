import { useSendOtp, useUserRegistration } from "@/api/Auth_api/Auth_api";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setResgister } from "@/redux/ModalSlice";

const FormLayout = () => {
  const { register } = useSelector((state: RootState) => state.model);
  const { sendOtp, isSendingOtp } = useSendOtp();
  const { userRegistration, isUserRegistrationPending } = useUserRegistration();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mt-4 min-w-md relative h-full">
      <h2 className="font-bold font-sans text-2xl text-center">
        Sign {register ? "up" : "in"} to{" "}
        <span className="text-primary">ITA WTC</span>
      </h2>
      <p className="text-gray-700 text-center">
        {register
          ? "Register you account and explore upcoming events"
          : "Get access to your profile and more"}
      </p>
      {!register ? (
        <LoginForm apiCall={sendOtp} isPending={isSendingOtp} />
      ) : (
        <SignupForm
          apiCall={userRegistration}
          isPending={isUserRegistrationPending}
        />
      )}
      <div className="absolute -bottom-4 w-full flex items-center justify-center">
        {!register ? (
          <p className="text-primary text-center">
            Don't have an account?{" "}
            <span
              className="font-semibold underline cursor-pointer"
              onClick={() => dispatch(setResgister(true))}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-primary text-center">
            Already have an account?{" "}
            <span
              className="font-semibold underline cursor-pointer"
              onClick={() => dispatch(setResgister(false))}
            >
              Sign in
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default FormLayout;
