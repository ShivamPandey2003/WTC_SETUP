import { Button } from "@/components/ui/Button";
import { signupSchema, type SignUpFromValue } from "@/Schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/services/apiService";

const ApiRecaptcha = import.meta.env.VITE_REACT_RECAPTCHA;

type FormProp = {
  apiCall: ({
    email,
    firstname,
    lastname,
  }: {
    email: string;
    firstname: string;
    lastname: string;
  }) => void;
  isPending: boolean;
};

const SignupForm: React.FC<FormProp> = ({ apiCall, isPending }) => {
  const [notARobot, setNotARobot] = useState<boolean>(false);
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<SignUpFromValue>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

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
      className="my-6 flex flex-col"
      onSubmit={handleEmailSubmit((data) => apiCall(data))}
      noValidate
    >
      <div className="mb-3">
        <label
          htmlFor="firstname"
          className="block text-[12px] text-primary mb-2"
        >
          First Name
        </label>
        <input
          id="firstname"
          type="text"
          placeholder="Robert"
          {...registerEmail("firstname")}
          className={`w-full px-4 py-2 bg-bgCard border ${
            emailErrors.firstname ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
        />
        {emailErrors.firstname && (
          <p className="mt-1 text-xs text-red-500">
            {emailErrors.firstname.message}
          </p>
        )}
      </div>
      <div className="mb-3">
        <label
          htmlFor="lastname"
          className="block text-[12px] text-primary mb-2"
        >
          Last Name
        </label>
        <input
          id="lastname"
          type="text"
          placeholder="Zyan"
          {...registerEmail("lastname")}
          className={`w-full px-4 py-2 bg-bgCard border ${
            emailErrors.lastname ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
        />
        {emailErrors.lastname && (
          <p className="mt-1 text-xs text-red-500">
            {emailErrors.lastname.message}
          </p>
        )}
      </div>
      <div className="mb-3">
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
          {isPending ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
