import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { env } from "@server/config/env";

export class AppLogger extends ConsoleLogger {
	private readonly isProduction = env.NODE_ENV === "production";

	private writeJson(
		level: LogLevel,
		message: unknown,
		context?: string,
		trace?: string,
	) {
		const entry: Record<string, unknown> = {
			timestamp: new Date().toISOString(),
			level,
			context: context ?? this.context ?? "App",
			message,
		};
		if (trace) {
			entry.trace = trace;
		}
		const line = `${JSON.stringify(entry)}\n`;
		if (level === "error" || level === "warn") {
			process.stderr.write(line);
		} else {
			process.stdout.write(line);
		}
	}

	override log(message: unknown, context?: string) {
		if (this.isProduction) {
			this.writeJson("log", message, context);
			return;
		}
		super.log(message, context);
	}

	override warn(message: unknown, context?: string) {
		if (this.isProduction) {
			this.writeJson("warn", message, context);
			return;
		}
		super.warn(message, context);
	}

	override error(message: unknown, trace?: string, context?: string) {
		if (this.isProduction) {
			this.writeJson("error", message, context, trace);
			return;
		}
		super.error(message, trace, context);
	}
}
