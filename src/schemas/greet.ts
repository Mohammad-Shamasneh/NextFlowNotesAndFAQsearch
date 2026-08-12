import { z } from "zod/v4";

export const greetInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(50, "Name is too long.")
      .refine(
        (name) => !/[\u0000-\u001f\u007f]/u.test(name),
        "Name contains unsupported control characters.",
      )
      .describe("The person's first name or preferred name to greet"),
  })
  .strict();
