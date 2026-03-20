import { z } from "zod";
import { allowedTypes } from "./exhibitorSchema";

export const SplashScreenSchema = z.object({
  title: z.string().min(2, "Label is required"),
  subtitle: z.string().min(1, "Floor level is required"),
  file: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
});

export type SplashScreenSchemaType = z.infer<typeof SplashScreenSchema>;
