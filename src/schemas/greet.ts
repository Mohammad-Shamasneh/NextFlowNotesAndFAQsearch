import { z } from "zod/v4";

// Input schema for the greet tool
export const greetInputSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(10)
    .describe("The person's first name or preferred name to greet"),
});
