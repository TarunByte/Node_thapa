import { z } from "zod";

export const envPort = z
  .object({
    PORT: z.coerce.number().default(3000),
  })
  .parse(process.env);

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
