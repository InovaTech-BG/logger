import { Inject, WithDeps } from "@inovatechbg/dependecy-injection";
import { get } from "stack-trace";
import { Terminal } from "terminal-utils";
import { Message } from "terminal-utils/message";
import { Logger } from "../logger";

@WithDeps()
export class ConsoleLogger extends Logger {
	@Inject(Terminal)
	private terminal!: Terminal; // Adicionando o operador '!' para indicar que será inicializado pelo injetor

	private formatMessage(message: string | Message, level: string): string {
		const now = new Date().toISOString();
		const trace = get();
		// Ignora os primeiros frames que pertencem ao logger
		const relevantTrace = trace.find(
			(frame) => !frame.getFileName()?.includes("console-logger"),
		);

		const fileName = relevantTrace?.getFileName() || "unknown";
		const lineNumber = relevantTrace?.getLineNumber() || 0;
		const baseName = fileName.split("/").slice(-2).join("/"); // Exemplo: src/services/UserService.ts

		const messageText =
			message instanceof Message ? message.toString() : message;
		return `[${now}] - ${baseName}:${lineNumber}: ${messageText}`;
	}

	private colorize(message: string | Message, level: string): Message {
		const messageText =
			message instanceof Message ? message.toString() : message;
		const messageInstance = new Message(messageText);
		switch (level) {
			case "debug":
				return messageInstance.colorizeFg("blue");
			case "info":
				return messageInstance.colorizeFg("green");
			case "warn":
				return messageInstance.colorizeFg("yellow");
			case "error":
			case "fatal":
				return messageInstance.colorizeFg("red");
			case "trace":
				return messageInstance.colorizeFg("magenta");
			default:
				return messageInstance;
		}
	}

	private log(message: string | Message, level: string): void {
		const formattedMessage = this.formatMessage(message, level);
		const coloredMessage = this.colorize(formattedMessage, level);
		this.terminal.writeln(coloredMessage);
		this.terminal.writeln(new Message("---")); // Separador
	}

	public debug(message: string | Message): void {
		this.log(message, "debug");
	}

	public info(message: string | Message): void {
		this.log(message, "info");
	}

	public warn(message: string | Message): void {
		this.log(message, "warn");
	}

	public error(message: string | Message): void {
		this.log(message, "error");
	}

	public fatal(message: string | Message): void {
		this.log(message, "fatal");
	}

	public trace(message: string | Message): void {
		const now = new Date().toISOString();
		const trace = get()
			.map((frame) => {
				const fileName = frame.getFileName() || "unknown";
				const lineNumber = frame.getLineNumber() || 0;
				const functionName = frame.getFunctionName() || "anonymous";
				return `${fileName}:${lineNumber} (${functionName})`;
			})
			.join(" -> ");

		const messageText =
			message instanceof Message ? message.toString() : message;
		const formattedMessage = `[${now}] - TRACE: ${messageText}\nStack Trace: ${trace}`;
		const coloredMessage = this.colorize(formattedMessage, "trace");
		this.terminal.writeln(coloredMessage);
		this.terminal.writeln(new Message("---")); // Separador
	}
}
