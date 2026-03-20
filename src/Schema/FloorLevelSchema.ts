import { z } from "zod";
import { allowedTypes } from "./exhibitorSchema";

export const FloorLevelSchema = z.object({
  label: z.string().min(2, "Label is required"),
  floor_level: z.number().min(1, "Floor level is required"),
  design_type: z.coerce.boolean(),
  iframe_url: z.url().optional(),
  file: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
});

export const EditFloorLevelSchema = z.object({
  label: z.string().min(2, "Label is required"),
  floor_level: z.number().min(1, "Floor level is required"),
  design_type: z.coerce.boolean(),
  iframe_url: z.url().optional(),
  file: z
    .custom<FileList | undefined>()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
});

export type FloorLevelSchemaType = z.infer<typeof FloorLevelSchema>;
