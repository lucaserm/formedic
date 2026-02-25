import type { FindManySchedulesFilters, SchedulesRepository } from "@/repositories/schedules-repository";

export type ListSchedulesRequest = FindManySchedulesFilters;

export class ListSchedulesUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute(filters: ListSchedulesRequest) {
    return this.schedulesRepository.findMany(filters);
  }
}
