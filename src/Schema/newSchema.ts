import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  tile_space: z.string().regex(/^\d+x$/, "tile_space must be like '1x' or '2x'"),
  is_active: z.boolean().default(true),
  is_published: z.boolean().default(false),
  "Created On": z.string().min(1, "Created On is required"),
  created_by: z.string().min(1, "Created by is required"),
  id: z.string().min(1, "ID is required"),
  attachments: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length > 0, "At least one file is required")
});

export type News = z.infer<typeof newsSchema>;
