import { beforeEach, describe, expect, it } from "bun:test";

import { InMemorySchedulesRepository } from "@/repositories/in-memory/in-memory-schedules-repository";

import { CreateScheduleUseCase } from "./create-schedule-use-case";

let sut: CreateScheduleUseCase;
let schedulesRepository: InMemorySchedulesRepository;

describe("use-case: create schedule", () => {
  beforeEach(() => {
    schedulesRepository = new InMemorySchedulesRepository();
    sut = new CreateScheduleUseCase(schedulesRepository);
  });
  
  it("should create a schedule successfully", async () => {
    const request = {
      patientId: "patient-1",
      professionalId: "professional-1",
      date: "2024-07-01",
      time: "10:00",
    };

    await sut.execute(request);

    expect(schedulesRepository.items).toHaveLength(1);
    expect(schedulesRepository.items[0]).toMatchObject(request);
  });
  
  it("should not allow scheduling conflicts", async () => {
    const request = {
      patientId: "patient-1",
      professionalId: "professional-1",
      date: "2024-07-01",
      time: "10:00",
    };

    await sut.execute(request);

    expect(sut.execute(request)).rejects.toThrow(
      "Já existe um agendamento para este profissional neste horário."
    );
  });
});
