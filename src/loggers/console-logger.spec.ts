import { ReadStream } from "node:tty";
import { container, dependecy } from "@inovatechbg/dependecy-injection";
import { Terminal, TerminalOptions } from "terminal-utils";
import { beforeEach, describe, it } from "vitest";
import { ConsoleLogger } from "./console-logger";

class FakeInput extends ReadStream {
	value = "";

	write(buffer: Uint8Array | string, cb?: (err?: Error) => void): boolean;
	write(
		str: Uint8Array | string,
		encoding?: BufferEncoding,
		cb?: (err?: Error) => void,
	): boolean;
	write(str: unknown, encoding?: unknown, cb?: unknown): boolean {
		this.value += str;
		return true;
	}

	read(): string {
		return this.value;
	}
}

describe("ConsoleLogger", () => {
	let logger: ConsoleLogger;
	let fakeTerminal: Terminal;
	let fakeInput: FakeInput;
	let fakeOutput: FakeInput;
	let fakeError: FakeInput;

	beforeEach(async () => {
		fakeInput = new FakeInput(1);
		fakeOutput = new FakeInput(1);
		fakeError = new FakeInput(1);

		const terminalOptions: TerminalOptions = {
			input: fakeInput,
			output: fakeOutput,
			error: fakeError,
		};

		fakeTerminal = new Terminal(terminalOptions);

		dependecy.registerFactory((container) => {
			container.register(Terminal, Terminal).singleton(fakeTerminal);
		})(container);

		logger = new ConsoleLogger();
	});

	afterEach(() => {
		container.clear();
	});

	it("should log debug messages", () => {
		const message = "Debug message";
		logger.debug(message);
		expect(fakeOutput.read()).toContain(message);
	});

	it("should log info messages", () => {
		const message = "Info message";
		logger.info(message);
		expect(fakeOutput.read()).toContain(message);
	});

	it("should log warn messages", () => {
		const message = "Warn message";
		logger.warn(message);
		expect(fakeOutput.read()).toContain(message);
	});

	it("should log error messages", () => {
		const message = "Error message";
		logger.error(message);
		expect(fakeOutput.read()).toContain(message);
	});

	it("should log fatal messages", () => {
		const message = "Fatal message";
		logger.fatal(message);
		expect(fakeOutput.read()).toContain(message);
	});

	it("should log trace messages", () => {
		const message = "Trace message";
		logger.trace(message);
		expect(fakeOutput.read()).toContain(message);
	});
});
