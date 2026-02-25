import { faker } from "@faker-js/faker";

import type { Patient } from "@/schemas/patient/patient.schema";

export function makePatient(override?: Partial<Patient>): Patient {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    ...override
  };
}
