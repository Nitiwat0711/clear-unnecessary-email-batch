import dotenv from "dotenv";
import winston, { format, transports } from "winston";
dotenv.config();

import { trace } from "@opentelemetry/api";

const { combine, timestamp, printf, colorize, simple } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  const activeSpan = trace.getActiveSpan();
  const traceId = activeSpan?.spanContext().spanId ?? "";
  const spanId = activeSpan?.spanContext().spanId ?? "";
  const traceFlags = activeSpan?.spanContext().traceFlags ?? "";

  return `${timestamp} ${level} [${traceId}, ${spanId}, ${traceFlags}] : ${message}`;
});

const configLogger = () => {
  if (process.env.NODE_ENV === "local") {
    return winston.createLogger({
      level: "debug",
      format: combine(timestamp(), colorize(), simple(), logFormat),
      defaultMeta: { service: "clear-unnecessary-email-batch" },
      transports: [new transports.Console()],
    });
  }

  return winston.createLogger({
    level: "info",
    format: combine(
      timestamp(),
      format.json()
      // colorize({ all: true })
    ),
    defaultMeta: { service: "clear-unnecessary-email-batch" },
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
      new transports.Console(),
    ],
  });
};

export const logger = configLogger();
