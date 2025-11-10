import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiRequest } from "@/services/apiService";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { mutate: Login, isPending: isSubmitting } = useMutation<
    LoginResponse,
    AxiosError,
    LoginFormValues
  >({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("post", "users/login", data);
      return res.response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.response.access_token);
      onClose()
      navigate("/global-design");
    },
    onError: (error: AxiosError) => {
      const msg =
        error.message ||
        "Login failed. Please check your credentials and try again.";
      console.error("Login failed:", error);
      toast.error(msg);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormValues) => {
    Login(data);
  };

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="w-full max-w-md p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg"
          noValidate
        >
          <h1 className="text-[16px] font-[700] text-black mb-8">
            Log in to your account
          </h1>

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-[12px] text-primary mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={`w-full px-4 py-2 bg-bgCard border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-[12px] text-primary mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              {...register("password")}
              className={`w-full px-4 py-2 bg-bgCard border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-primary text-gray-900 placeholder-gray-400`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
