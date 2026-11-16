import { z } from "zod";

export const httpUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "Only HTTP and HTTPS URLs are allowed");
