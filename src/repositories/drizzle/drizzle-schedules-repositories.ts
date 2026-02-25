import { and, eq } from "drizzle-orm";
import { v7 } from "uuid";

import { schedules } from "@/db/schema";
import { InternalServerError } from "@/errors/http/internal-server-error";
import { db } from "@/lib/drizzle";

import type {
  CreateScheduleProps,
  FindManySchedulesFilters,
  SchedulesRepository,
} from "../schedules-repository";

export class DrizzleSchedulesRepository implements SchedulesRepository {
  async create({ patientId, professionalId, date, time }: CreateScheduleProps) {
    const id = v7();
    const [schedule] = await db
      .insert(schedules)
      .values({
        id,
        patientId,
        professionalId,
        date,
        time,
      })
      .returning();

    if (!schedule) {
      throw new InternalServerError("Erro ao criar agendamento.");
    }

    return schedule;
  }

  async findByProfessionalAndDateTime(
    professionalId: string,
    date: string,
    time: string,
  ) {
    const schedule = await db.query.schedules.findFirst({
      where: (schedules, { eq }) =>
        eq(schedules.professionalId, professionalId) &&
        eq(schedules.date, date) &&
        eq(schedules.time, time),
    });

    return schedule;
  }

  async findMany({ date, professionalId }: FindManySchedulesFilters = {}) {
    const filters = [];

    if (date) {
      filters.push(eq(schedules.date, date));
    }

    if (professionalId) {
      filters.push(eq(schedules.professionalId, professionalId));
    }

    return db.query.schedules.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
    });
  }
}
