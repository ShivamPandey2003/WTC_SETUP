import { Button } from "@/components/ui/Button";
import { emailSchema, type EmailFormValues } from "@/Schema/authSchema";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { apiRequest } from "@/services/apiService";

const ApiRecaptcha = import.meta.env.VITE_REACT_RECAPTCHA;

type FormProp = {
  apiCall: ({ email }: { email: string }) => void;
  isPending: boolean;
};

const LoginForm: React.FC<FormProp> = ({ apiCall, isPending }) => {
  const [notARobot, setNotARobot] = useState<boolean>(false);
  const { email } = useSelector((state: RootState) => state.ExtraSlice);
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (email) {
      reset({
        email,
      });
    }
  }, [email]);

  async function onChange(token: string | null) {
    try {
      if (!token) return;

      const response = await apiRequest("post", "/verify-captcha", {
        captcha_token: token,
      });

      if (response.response.response.success) {
        setNotARobot(true);
      } else {
        setNotARobot(false);
      }
    } catch (error) {
      setNotARobot(false);
    }
  }

  return (
    <form
      className="my-8 flex flex-col"
      onSubmit={handleEmailSubmit((data) => {
        apiCall(data)
      })}
      noValidate
    >
      <div className="mb-6">
        <label htmlFor="email" className="block text-[12px] text-primary mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          {...registerEmail("email")}
          className={`w-full px-4 py-2 bg-bgCard border ${
            emailErrors.email ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
        />
        {emailErrors.email && (
          <p className="mt-1 text-xs text-red-500">
            {emailErrors.email.message}
          </p>
        )}
      </div>
      <ReCAPTCHA
        sitekey={ApiRecaptcha}
        onChange={onChange}
        onExpired={() => {
          setNotARobot(false);
        }}
        className="self-center mb-3"
      />
      <div className="flex justify-center">
        <Button type="submit" disabled={isPending || !notARobot}>
          {isPending ? "Sending OTP..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
