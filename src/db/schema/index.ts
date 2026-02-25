import { pgTable, text, unique } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const professionals = pgTable("professionals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const schedules = pgTable(
  "schedules",
  {
    id: text("id").primaryKey(),
    patientId: text("patient_id").notNull(),
    professionalId: text("professional_id").notNull(),
    date: text("date").notNull(), // DD-MM-YYYY
    time: text("time").notNull(), // HH:MM
  },
  (t) => [unique("no_conflict").on(t.professionalId, t.date, t.time)],
);
