import z from "zod";

export const professional = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export type Professional = z.infer<typeof professional>;
