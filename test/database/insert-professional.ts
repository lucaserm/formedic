import { professionals } from "@/db/schema";
import { db } from "@/lib/drizzle";
import type { Professional } from "@/schemas/professional/professional.schema";

import { makeProfessional } from "../factories/make-professional";

export type InsertProfessionalOverride = Partial<Professional>;

export async function insertProfessional(
  override?: InsertProfessionalOverride,
) {
  const data = makeProfessional(override);

  await db.insert(professionals).values(data);

  return { professional: data };
}
