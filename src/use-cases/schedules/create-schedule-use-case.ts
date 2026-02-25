import { ConflictError } from "@/errors/http/conflict-error";
import type { SchedulesRepository } from "@/repositories/schedules-repository";
import type { Schedule } from "@/schemas/schedule/schedule.schema";

export interface CreateScheduleRequest {
  patientId: string;
  professionalId: string;
  date: string; // DD-MM-YYYY
  time: string; // HH:MM
}

export interface CreateScheduleResponse {
  schedule: Schedule;
}

export class CreateScheduleUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute({
    patientId,
    professionalId,
    date,
    time,
  }: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    const conflict =
      await this.schedulesRepository.findByProfessionalAndDateTime(
        professionalId,
        date,
        time,
      );

    if (conflict) {
      throw new ConflictError(
        "Já existe um agendamento para este profissional neste horário.",
      );
    }

    const schedule = await this.schedulesRepository.create({
      patientId,
      professionalId,
      date,
      time,
    });

    return { schedule };
  }
}
