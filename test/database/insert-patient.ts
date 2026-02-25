import { patients } from "@/db/schema";
import { db } from "@/lib/drizzle";
import type { Patient } from "@/schemas/patient/patient.schema";

import { makePatient } from "../factories/make-patient";

export type InsertPatientOverride = Partial<Patient>;

export async function insertPatient(override?: InsertPatientOverride) {
  const data = makePatient(override);

  await db.insert(patients).values(data);

  return { patient: data };
}
