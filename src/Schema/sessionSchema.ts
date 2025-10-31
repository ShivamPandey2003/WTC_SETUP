import { z } from "zod";

export const sessionSchema = z.object({
  sno: z.number().int().positive(),
  session_id: z.string().min(1, "Session ID is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  start_time: z.string().datetime(),  // ISO 8601 format
  end_time: z.string().datetime(),    // ISO 8601 format
  speakers: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
  external_link: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  created_on: z.string().datetime(),
});

export type Session = z.infer<typeof sessionSchema>;
