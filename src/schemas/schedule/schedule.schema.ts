import z from "zod";

export const schedule = z.object({
  id: z.string(),
  patientId: z.string(),
  professionalId: z.string(),
  date: z.string(), // DD-MM-YYYY
  time: z.string(), // HH:MM
});

export type Schedule = z.infer<typeof schedule>;
