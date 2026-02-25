import { faker } from "@faker-js/faker";

import type { Schedule } from "@/schemas/schedule/schedule.schema";

export function makeSchedule(override?: Partial<Schedule>): Schedule {
  const d = faker.date.future();

  const date = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  return {
    id: faker.string.uuid(),
    date,
    time,
    patientId: faker.string.uuid(),
    professionalId: faker.string.uuid(),
    ...override,
  };
}
