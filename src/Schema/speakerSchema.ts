import { z } from "zod";

export const speakerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  external_link: z.url().optional(),
  attachments: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length > 0,
      "At least one file is required"
    )
});

export type SpeakerForm = z.infer<typeof speakerSchema>;
