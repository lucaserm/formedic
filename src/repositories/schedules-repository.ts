import type { Schedule } from "@/schemas/schedule/schedule.schema";

export interface CreateScheduleProps {
  patientId: string;
  professionalId: string;
  date: string; // DD-MM-YYYY
  time: string; // HH:MM  
}

export interface FindManySchedulesFilters {
  date?: string;
  professionalId?: string;
}

export interface SchedulesRepository {
  create(data: CreateScheduleProps): Promise<Schedule>;
  findByProfessionalAndDateTime(
    professionalId: string,
    date: string,
    time: string,
  ): Promise<Schedule | undefined>;
  findMany(filters?: FindManySchedulesFilters): Promise<Schedule[]>;
}
