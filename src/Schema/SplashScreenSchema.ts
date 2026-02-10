import { z } from "zod";

export const SplashScreenSchema = z.object({
  title: z.string().min(2, "Label is required"),
  subtitle: z.string().min(1, "Floor level is required"),
  file: z.instanceof(FileList).optional(),
});

export type SplashScreenSchemaType = z.infer<typeof SplashScreenSchema>;
