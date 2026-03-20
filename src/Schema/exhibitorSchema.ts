import { z } from "zod";

export const allowedTypes = [
  "image/png",
  "image/jpg",
  "image/webp",
  "image/jpeg"
];

export const ExhibitorSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  url: z.url(),
  email: z.email(),
  show_mail: z.boolean(),
  logo: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length > 0,
      "At least one file is required",
    ).refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
  category: z.string().min(2, "Category is required"),
  ads: z.boolean(),
});

export const EditExhibitorSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  url: z.url(),
  email: z.email(),
  show_mail: z.boolean(),
  logo: z
    .custom<FileList | undefined>()
    .optional().refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
  category: z.string().min(2, "Category is required"),
  ads: z.boolean(),
});

export type ExhibitorSchemaType = z.infer<typeof ExhibitorSchema>;
