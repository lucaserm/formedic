import { faker } from "@faker-js/faker";

import type { Patient } from "@/schemas/patient/patient.schema";
import type { Professional } from "@/schemas/professional/professional.schema";
import { insertPatient } from "@test/database/insert-patient";
import { insertProfessional } from "@test/database/insert-professional";
import { insertSchedule } from "@test/database/insert-schedule";

const patients: Patient[] = [];
const professionals: Professional[] = [];

// insert 10 patients
for (let i = 1; i <= 10; i++) {
  const { patient } = await insertPatient();
  patients.push(patient);
}
console.log(`Inserted ${patients.length} patients.`);

//insert 10 professionals
for (let i = 1; i <= 10; i++) {
  const { professional } = await insertProfessional();
  professionals.push(professional);
}
console.log(`Inserted ${patients.length} patients.`);

for (const patient of patients) {
  // for each patient, schedule 4 appointments with random professionals
  const professionalsToSchedule = faker.helpers.arrayElements(professionals, 4);

  for (const professionalToSchedule of professionalsToSchedule) {
    await insertSchedule({
      patientId: patient.id,
      professionalId: professionalToSchedule.id,
    });
  }

  console.log(
    `Patient ${patient.name} scheduled with professionals: ${professionalsToSchedule.map((p) => p.name).join(", ")}`,
  );
}
