import * as vscode from 'vscode';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let outputChannel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Image Webify AI Tool');
  }
  return outputChannel;
}

function getConfiguredLevel(): LogLevel {
  const config = vscode.workspace.getConfiguration('imageWebifyAi');
  return (config.get<LogLevel>('logLevel') ?? 'info');
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[getConfiguredLevel()];
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;
  const timestamp = new Date().toISOString();
  const formatted = args.length > 0
    ? `[${timestamp}] [${level.toUpperCase()}] ${message} ${args.map(a => JSON.stringify(a)).join(' ')}`
    : `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  getChannel().appendLine(formatted);
  if (level === 'error') {
    console.error(formatted);
  }
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
  dispose: () => {
    outputChannel?.dispose();
    outputChannel = undefined;
  },
  show: () => getChannel().show(),
};
