import Elysia from "elysia";

import { createScheduleRoute } from "./create-schedule";
import { listSchedulesRoute } from "./list-schedules";

export const scheduleRoutes = new Elysia({ prefix: "/schedules" })
  .use(createScheduleRoute)
  .use(listSchedulesRoute);