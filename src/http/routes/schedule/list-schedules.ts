import Elysia from "elysia";
import z from "zod";

import { makeListSchedulesUseCase } from "@/use-cases/_factories/make-list-schedules-use-case";

export const listSchedulesQuery = z.object({
  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY")
    .optional(),
  professionalId: z.string().uuid().optional(),
});

export const listSchedulesRoute = new Elysia().get(
  "/",
  async ({ query }) => {
    const service = makeListSchedulesUseCase();
    return service.execute(query);
  },
  { query: listSchedulesQuery },
);
