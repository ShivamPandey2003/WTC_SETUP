import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiRequest } from "@/services/apiService";
import type { EmailFormValues, SignUpFromValue } from "@/Schema/authSchema";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  increaseResendCount,
  setOtp,
  setResendCooldown,
  setUserInfo,
} from "@/redux/AuthSlice";
import { setLoginModel, setResgister } from "@/redux/ModalSlice";
import { useNavigate } from "react-router";
import { setEmail, setStep } from "@/redux/ExtraSlice";

const coolDownTime =
  Number(import.meta.env.VITE_REACT_COOLDOWN_TIME_SECONDS) || 60000;

export const useSendOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation<
    ProfilePicResponse,
    AxiosError,
    EmailFormValues
  >({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "user/login", data);
      return res.response;
    },
    onSuccess: (_, variables) => {
      toast.success("OTP sent successfully!");
      dispatch(setEmail(variables.email));
      const now = Date.now();
      // if (resendCount + 1 === 1) {
      dispatch(setResendCooldown(now + coolDownTime));
      // }
      dispatch(setStep("otp"));
      dispatch(increaseResendCount());
    },
  });

  return { sendOtp, isSendingOtp };
};

export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: verifyOtp, isPending: isVerifying } = useMutation<
    OtpResponse,
    AxiosError,
    { email: string; otp: string }
  >({
    mutationFn: async (data) => {
      const res = await apiRequest("post", "user/verify-otp", data);
      return res.response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.response.access_token);
      dispatch(
        setUserInfo({
          firstname: data.response.firstname,
          lastname: data.response.lastname,
          grp: data.response.grp,
          is_verified: data.response.is_verified,
        }),
      );
      if (!data.response.is_verified && data.response.grp !== 1) {
        navigate("/onboarding");
      } else if (data.response.grp !== 1) {
        navigate("/");
      } else {
        navigate("/global-design");
      }
      toast.success("Login successful!");
      dispatch(setEmail(""));
      dispatch(setStep("email"));
      dispatch(setOtp(["", "", "", "", "", ""]));
      dispatch(setLoginModel(false));
    },
  });

  return { verifyOtp, isVerifying };
};

export const useResendOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resendCount } = useSelector(
    (state: RootState) => state.AuthSlice,
  );
  const { email } = useSelector(
    (state: RootState) => state.ExtraSlice,
  );
  const { mutate: Resend, isPending: isResendPending } = useMutation<
    ResendResponse,
    AxiosError
  >({
    mutationFn: async () => {
      const res = await apiRequest("post", "user/resend-otp", { email: email });
      return res.response;
    },
    onSuccess: () => {
      dispatch(increaseResendCount());

      const now = Date.now();

      if (resendCount + 1 >= 4) {
        dispatch(setResendCooldown(Infinity));
      } else {
        dispatch(setResendCooldown(now + coolDownTime));
      }

      toast.success("OTP Resent!");
    },
  });

  return { Resend, isResendPending };
};

export const useUserRegistration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: userRegistration, isPending: isUserRegistrationPending } =
    useMutation<ProfilePicResponse, AxiosError, SignUpFromValue>({
      mutationFn: async (data) => {
        const res = await apiRequest("post", "/user/signup", data);
        return res.response;
      },
      onSuccess: (_, variables) => {
        toast.success("User signed up successfully!");
        dispatch(setEmail(variables.email));
        dispatch(setResgister(false));
      },
    });

  return { userRegistration, isUserRegistrationPending };
};
