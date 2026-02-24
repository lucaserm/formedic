import Elysia from "elysia";
import z from "zod";

export const createScheduleBody = z.object({
  date: z.string(),
  time: z.string(),
  doctorId: z.string(),
});

export const createScheduleRoute = new Elysia().post("/", async () => {}, {
  body: createScheduleBody,
});
