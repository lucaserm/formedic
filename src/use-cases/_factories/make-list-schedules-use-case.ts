import { DrizzleSchedulesRepository } from "@/repositories/drizzle/drizzle-schedules-repositories";

import { ListSchedulesUseCase } from "../schedules/list-schedules-use-case";

export function makeListSchedulesUseCase() {
  const repository = new DrizzleSchedulesRepository();
  const useCase = new ListSchedulesUseCase(repository);
  return useCase;
}
