import { DrizzleSchedulesRepository } from "@/repositories/drizzle/drizzle-schedules-repositories";

import { CreateScheduleUseCase } from "../schedules/create-schedule-use-case";

export function makeCreateScheduleUseCase() {
  const repository = new DrizzleSchedulesRepository();
  const useCase = new CreateScheduleUseCase(repository);
  return useCase;
}
