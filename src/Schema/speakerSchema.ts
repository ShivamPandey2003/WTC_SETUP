import { z } from "zod";

export const speakerSchema = z.object({
  speaker_id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  designation: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  external_link: z.string().url().optional().nullable(),
  created_on: z.string().datetime(),
  attachments: z.array(z.string()).optional().default([]),
});

export type Speaker = z.infer<typeof speakerSchema>;
