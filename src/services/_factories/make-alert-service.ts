import { env } from "@/env";
import { FakeAlertService } from "@/services/fake/fake-alert-service";

export function makeAlertService() {
  if (env.NODE_ENV === "test") {
    return new FakeAlertService();
  }

  return new FakeAlertService();
}
