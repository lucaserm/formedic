import Elysia from "elysia";
import z from "zod";

import { makeCreateScheduleUseCase } from "@/use-cases/_factories/make-create-schedule-use-case";

export const createScheduleBody = z.object({
  patientId: z.string().uuid(),
  professionalId: z.string().uuid(),
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Formato esperado: DD-MM-YYYY"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Formato esperado: HH:MM"),
});

export const createScheduleRoute = new Elysia().post(
  "/",
  async ({ body, set }) => {
    const service = makeCreateScheduleUseCase();
    const schedule = await service.execute(body);
    set.status = 201;
    return schedule;
  },
  { body: createScheduleBody },
);
