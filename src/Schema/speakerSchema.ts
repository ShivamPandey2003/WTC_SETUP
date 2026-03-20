import { z } from "zod";
import { allowedTypes } from "./exhibitorSchema";

export const speakerSchema = z.object({
  prefix: z.string().optional().nullable(),
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  designation: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  email: z.email("Invalid email address"),
  external_link: z.url().optional().or(z.literal("")),
  attachments: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ["application/pdf"].includes(files[0].type);
    }, "Only PDF are allowed"),
  profile_image: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
  linkedin_url: z.url().optional().or(z.literal("")),
  whatsapp_url: z.url().optional().or(z.literal("")),
  keyNote: z.boolean(),
  show_mail: z.boolean(),
});

export const EditspeakerSchema = z.object({
  prefix: z.string().optional().nullable(),
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  designation: z.string().optional().nullable(),
  // email: z.email("Invalid email address"),
  company: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  external_link: z.url().optional().or(z.literal("")),
  attachments: z
    .custom<FileList | undefined>()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ["application/pdf"].includes(files[0].type);
    }, "Only PDF are allowed"),
  profile_image: z
    .custom<FileList | undefined>()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return allowedTypes.includes(files[0].type);
    }, "Only PNG, JPG, WEBP, JPEG images are allowed"),
  linkedin_url: z.url().optional().or(z.literal("")),
  whatsapp_url: z.url().optional().or(z.literal("")),
  keyNote: z.boolean(),
  show_mail: z.boolean(),
});

export type SpeakerForm = z.infer<typeof speakerSchema>;

export type EditSpeakerFrom = z.infer<typeof EditspeakerSchema>;
