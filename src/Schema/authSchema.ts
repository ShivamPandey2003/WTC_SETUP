import {z} from 'zod'

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  firstname: z.string().min(3, "First name is required"),
  lastname: z.string().min(3, "Last name is required"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type SignUpFromValue = z.infer<typeof signupSchema>