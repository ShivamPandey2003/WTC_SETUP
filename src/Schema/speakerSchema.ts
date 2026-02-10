import { z } from "zod";

export const speakerSchema = z.object({
  prefix: z.string().optional().nullable(),
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  designation: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  external_link: z.url().optional(),
  attachments: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length > 0,
      "At least one file is required",
    ),
  profile_image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length > 0,
      "At least one file is required",
    ),
  linkedin_url: z.url().optional(),
  whatsapp_url: z.url().optional(),
  keyNote: z.boolean(),
});

export type SpeakerForm = z.infer<typeof speakerSchema>;
