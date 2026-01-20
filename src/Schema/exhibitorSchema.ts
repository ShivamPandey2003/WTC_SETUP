import { z } from "zod";

export const ExhibitorSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  url: z.url(),
  email: z.email(),
  logo: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length > 0,
      "At least one file is required",
    ),
  category: z.string().min(2, "Category is required"),
  ads: z.boolean(),
});

export type ExhibitorSchemaType = z.infer<typeof ExhibitorSchema>;
