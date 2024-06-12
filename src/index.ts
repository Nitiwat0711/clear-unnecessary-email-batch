import { configTracing } from "./config/tracing.config";
import { ClearUnnecessaryEmailController } from "./modules/gmail/useCases/clear-unnecessary-email.controller";
import { GmailClientFactory } from "./shared/infra/client/gmail/gmail-client.factory";
import { GoogleClientFactory } from "./shared/infra/client/googleapis/google-client.factory";

async function main() {
  await GoogleClientFactory.createClient();
  await GmailClientFactory.createClient();

  const tracer = configTracing();

  tracer.startActiveSpan("main", async (span) => {
    const controller = new ClearUnnecessaryEmailController();
    await controller.execute();
    span.end();
  });
}

main();
