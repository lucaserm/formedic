import { schedules } from "@/db/schema";
import { db } from "@/lib/drizzle";
import type { Schedule } from "@/schemas/schedule/schedule.schema";
import type { RequiredFields } from "@/utils/ts/required-fields";

import { makeSchedule } from "../factories/make-schedule";

export type InsertScheduleOverride = RequiredFields<
  Schedule,
  "patientId" | "professionalId"
>;

export async function insertSchedule(override: InsertScheduleOverride) {
  const data = makeSchedule(override);

  await db.insert(schedules).values(data);

  return { schedule: data };
}
