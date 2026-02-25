CREATE TABLE "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"professional_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	CONSTRAINT "no_conflict" UNIQUE("professional_id","date","time")
);
