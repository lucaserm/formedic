import { v7 } from "uuid";

import type { Schedule } from "@/schemas/schedule/schedule.schema";

import type {
  CreateScheduleProps,
  FindManySchedulesFilters,
  SchedulesRepository,
} from "../schedules-repository";

export class InMemorySchedulesRepository implements SchedulesRepository {
  items: Schedule[] = [];

  async create(data: CreateScheduleProps) {
    const schedule = {
      id: v7(),
      patientId: data.patientId,
      professionalId: data.professionalId,
      date: data.date,
      time: data.time,
    };

    this.items.push(schedule);

    return schedule;
  }

  async findByProfessionalAndDateTime(
    professionalId: string,
    date: string,
    time: string,
  ) {
    return this.items.find(
      (item) =>
        item.professionalId === professionalId &&
        item.date === date &&
        item.time === time,
    );
  }

  async findMany({ date, professionalId }: FindManySchedulesFilters = {}) {
    return this.items.filter((item) => {
      if (date && item.date !== date) return false;
      if (professionalId && item.professionalId !== professionalId) return false;
      return true;
    });
  }
}
