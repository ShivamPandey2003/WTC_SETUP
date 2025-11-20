import React, { useRef, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setOtp, type OTP } from "@/redux/AuthSlice";
import {
  emailSchema,
  otpSchema,
  type EmailFormValues,
  type OtpFormValues,
} from "@/Schema/authSchema";
import {
  useResendOtp,
  useSendOtp,
  useVerifyOtp,
} from "@/api/Auth_api/Auth_api";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { email, otp, step, resendCooldownEnd } = useSelector(
    (state: RootState) => state.AuthSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = React.useState(0);

  const { sendOtp, isSendingOtp } = useSendOtp();
  const { verifyOtp, isVerifying } = useVerifyOtp();
  const { Resend, isResendPending } = useResendOtp();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (resendCooldownEnd === Infinity) {
        setTimeLeft(0);
        return;
      }

      const diff = resendCooldownEnd - Date.now();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldownEnd]);

  const isDisabled =
    isResendPending || resendCooldownEnd === Infinity || timeLeft > 0;

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  const {
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

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
    e: KeyboardEvent<HTMLInputElement>
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
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="relative bg-white rounded-lg p-4 w-full max-w-md mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        {step === "email" && (
          <form
            onSubmit={handleEmailSubmit((data) => sendOtp(data))}
            noValidate
          >
            <h1 className="text-[16px] font-[700] text-black mb-6">
              Log in to your account
            </h1>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-[12px] text-primary mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...registerEmail("email")}
                className={`w-full px-4 py-2 bg-bgCard border ${
                  emailErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
              />
              {emailErrors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={isSendingOtp}>
                {isSendingOtp ? "Sending OTP..." : "Continue"}
              </Button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <h1 className="text-[16px] font-[700] text-black mb-2">
              Enter verification code
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              We sent a code to <span className="font-medium">{email}</span>
            </p>

            <div className="flex gap-2 justify-between mb-4">
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
                  className={`w-full aspect-square text-center text-xl font-semibold bg-gray-50 border ${
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
                className={`text-primary text-sm font-medium mt-4 transition-colors ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-green-800"
                }`}
              >
                {resendCooldownEnd === Infinity
                  ? "Resend disabled"
                  : timeLeft > 0
                  ? `Resend in ${timeLeft}s`
                  : "Resend code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
