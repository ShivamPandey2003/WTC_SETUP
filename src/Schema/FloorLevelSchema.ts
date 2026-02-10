import { z } from "zod";

export const FloorLevelSchema = z.object({
    label: z.string().min(2, "Label is required"),
    floor_level: z.number().min(1, "Floor level is required"),
    file: z
    .instanceof(FileList)
    .optional(),
})

export type FloorLevelSchemaType = z.infer<typeof FloorLevelSchema>;