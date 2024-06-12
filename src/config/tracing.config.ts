import { trace } from "@opentelemetry/api";
import { logs } from "@opentelemetry/api-logs";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { Resource } from "@opentelemetry/resources";
import {
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

export const configTracing = () => {
  const tracerProvider = new NodeTracerProvider({
    resource: new Resource({
      ["service.name"]: "clear-unnecessary-email-batch",
    }),
  });
  tracerProvider.register();

  const loggerProvider = new LoggerProvider();
  loggerProvider.addLogRecordProcessor(
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
  );
  logs.setGlobalLoggerProvider(loggerProvider);

  registerInstrumentations({
    tracerProvider: tracerProvider,
    instrumentations: [
      new WinstonInstrumentation({
        enabled: true,
        // See below for Winston instrumentation options.
        logHook: (span, record) => {
          record["resource.service.name"] = "clear-unnecessary-email-batch";
        },
      }),
    ],
  });

  tracerProvider.register();

  return trace.getTracer("clear-unnecessary-email-batch");
};
