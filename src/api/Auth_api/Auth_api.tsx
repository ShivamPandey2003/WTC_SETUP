import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiRequest } from "@/services/apiService";
import type { EmailFormValues } from "@/Schema/authSchema";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  increaseResendCount,
  setEmail,
  setOtp,
  setResendCooldown,
  setStep,
  setUserInfo,
} from "@/redux/AuthSlice";
import { setLoginModel } from "@/redux/ModalSlice";
import { useNavigate } from "react-router";

const coolDownTime =
  Number(import.meta.env.VITE_REACT_COOLDOWN_TIME_SECONDS) || 60000;

export const useSendOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resendCount } = useSelector((state: RootState) => state.AuthSlice);
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

      if (resendCount + 1 === 1) {
        dispatch(setResendCooldown(now + coolDownTime));
      }
      dispatch(setStep("otp"));
      dispatch(increaseResendCount());
    },
    onError: (error) => {
      toast.error(error.message);
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
        }),
      );
      navigate("/global-design");
      toast.success("Login successful!");
      dispatch(setEmail(""));
      dispatch(setStep("email"));
      dispatch(setOtp(["", "", "", "", "", ""]));
      dispatch(setLoginModel(false));
    },
    onError: (error) => {
      toast.error(error.message || "Invalid OTP");
    },
  });

  return { verifyOtp, isVerifying };
};

export const useResendOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { email, resendCount } = useSelector(
    (state: RootState) => state.AuthSlice,
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

      if (resendCount + 1 === 2) {
        dispatch(setResendCooldown(now + coolDownTime));
      }

      if (resendCount + 1 >= 3) {
        dispatch(setResendCooldown(Infinity));
      }

      toast.success("OTP Resent!");
    },
    onError: (error) => {
      toast.error(error.message || "NOT WORKING OTP");
    },
  });

  return { Resend, isResendPending };
};
