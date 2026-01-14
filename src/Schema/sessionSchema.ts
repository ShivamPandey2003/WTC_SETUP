import { z } from "zod";

export const SessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  venueID: z.string().min(1, "Venue is required"),
  speakers: z.string().min(1, "Speakers are required"),
  description: z.string().min(1, "Description is required"),
  external_link: z.string().url("Invalid URL").optional().or(z.literal("")),
  attachments: z
    .instanceof(FileList)
    .optional()
    // .refine((files) => !files || files.length > 0, "At least one file is required"),
});

// Infer the form type:
export type SessionForm = z.infer<typeof SessionSchema>;