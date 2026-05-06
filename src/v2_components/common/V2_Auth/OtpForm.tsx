import { useResendOtp, useVerifyOtp } from "@/api/Auth_api/Auth_api";
import { Button } from "@/components/ui/Button";
import { setOtp, type OTP } from "@/redux/AuthSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { otpSchema, type OtpFormValues } from "@/Schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const OtpForm = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const { verifyOtp, isVerifying } = useVerifyOtp();
  const { Resend, isResendPending } = useResendOtp();
  const dispatch = useDispatch<AppDispatch>();
  const { otp, resendCooldownEnd } = useSelector(
    (state: RootState) => state.AuthSlice,
  );
  const { email } = useSelector(
    (state: RootState) => state.ExtraSlice,
  );
  const {
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  React.useEffect(() => {
    const update = () => {
      if (resendCooldownEnd === Infinity) {
        setTimeLeft(0);
        return;
      }

      const diff = resendCooldownEnd - Date.now();
      setTimeLeft(Math.max(0, Math.ceil(diff / 1000))); // use ceil
    };

    update(); // immediate sync

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [resendCooldownEnd]);

  const isDisabled =
    isResendPending || resendCooldownEnd === Infinity || timeLeft > 0;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp] as OTP;
    newOtp[index] = value.slice(-1);
    dispatch(setOtp(newOtp));
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = pastedData.split("").slice(0, 6) as OTP;
    dispatch(setOtp(newOtp));
    inputRefs.current[Math.min(5, newOtp.length - 1)]?.focus();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    verifyOtp({ email, otp: otpValue });
  };

  return (
    <form className="my-8" onSubmit={handleOtpSubmit}>
      <h1 className="font-bold font-sans text-2xl mb-2 text-center">
        Enter verification code
      </h1>
      <p className="text-gray-700 text-center mb-8">
        We sent a code to <span className="font-medium">{email}</span>
      </p>

      <div className="flex gap-2 justify-evenly mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={index === 0 ? handleOtpPaste : undefined}
            className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold bg-gray-50 border ${
              otpErrors.otp ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center">
        <Button type="submit" disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>

        <button
          type="button"
          onClick={() => Resend()}
          disabled={isDisabled}
          className={`text-primary text-sm font-medium mt-4 transition-colors underline ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-green-800 cursor-pointer"
          }`}
        >
          {resendCooldownEnd === Infinity
            ? "Resend code"
            : timeLeft > 0
              ? `Resend in ${timeLeft}s`
              : "Resend code"}
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
