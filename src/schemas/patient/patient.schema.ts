import z from "zod";

export const patient = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export type Patient = z.infer<typeof patient>;