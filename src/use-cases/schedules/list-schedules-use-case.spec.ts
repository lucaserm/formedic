import { beforeEach, describe, expect, it } from "bun:test";

import { InMemorySchedulesRepository } from "@/repositories/in-memory/in-memory-schedules-repository";

import { ListSchedulesUseCase } from "./list-schedules-use-case";

let sut: ListSchedulesUseCase;
let schedulesRepository: InMemorySchedulesRepository;

describe("use-case: list schedules", () => {
  beforeEach(async () => {
    schedulesRepository = new InMemorySchedulesRepository();
    sut = new ListSchedulesUseCase(schedulesRepository);

    await schedulesRepository.create({
      patientId: "patient-1",
      professionalId: "professional-1",
      date: "2024-07-01",
      time: "10:00",
    });

    await schedulesRepository.create({
      patientId: "patient-2",
      professionalId: "professional-1",
      date: "2024-07-01",
      time: "11:00",
    });

    await schedulesRepository.create({
      patientId: "patient-3",
      professionalId: "professional-2",
      date: "2024-07-02",
      time: "09:00",
    });
  });

  it("should list all schedules when no filters are provided", async () => {
    const result = await sut.execute({});

    expect(result).toHaveLength(3);
  });

  it("should filter schedules by date", async () => {
    const result = await sut.execute({ date: "2024-07-01" });

    expect(result).toHaveLength(2);
    expect(result.every((s) => s.date === "2024-07-01")).toBe(true);
  });

  it("should filter schedules by professionalId", async () => {
    const result = await sut.execute({ professionalId: "professional-1" });

    expect(result).toHaveLength(2);
    expect(result.every((s) => s.professionalId === "professional-1")).toBe(true);
  });

  it("should filter schedules by date and professionalId combined", async () => {
    const result = await sut.execute({
      date: "2024-07-01",
      professionalId: "professional-1",
    });

    expect(result).toHaveLength(2);
  });

  it("should return empty array when no schedules match the filters", async () => {
    const result = await sut.execute({ date: "2099-01-01" });

    expect(result).toHaveLength(0);
  });
});
