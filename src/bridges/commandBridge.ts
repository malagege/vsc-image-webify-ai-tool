import * as vscode from 'vscode';
import { KNOWN_DEPENDENCY_COMMANDS } from '../constants/ids';
import { ConversionRequest, ConversionResult } from '../types/conversion';
import { logger } from '../utils/logger';

export async function executeCommandBridge(request: ConversionRequest): Promise<ConversionResult> {
  logger.info(`Command bridge: converting ${request.input} to ${request.targetFormat}`);

  const command = getDependencyCommand(request.targetFormat);
  if (!command) {
    throw new Error(`No command bridge available for target format ${request.targetFormat}`);
  }

  try {
    const allCommands = await vscode.commands.getCommands(true);
    if (!allCommands.includes(command)) {
      throw new Error(`Command ${command} is not registered`);
    }

    await vscode.commands.executeCommand(command, vscode.Uri.file(request.input), {
      format: request.targetFormat,
      quality: request.quality,
      output: request.output,
    });

    return {
      success: true,
      strategy: 'command-bridge',
      input: request.input,
      output: request.output,
      targetFormat: request.targetFormat,
      quality: request.quality,
      message: `Image converted successfully via command bridge (${command})`,
    };
  } catch (err) {
    logger.warn(`Command ${command} failed: ${err}`);
  }

  throw new Error('No available command bridge succeeded');
}

function getDependencyCommand(targetFormat: string): string | undefined {
  switch (targetFormat) {
    case 'webp':
      return KNOWN_DEPENDENCY_COMMANDS[0];
    case 'avif':
      return KNOWN_DEPENDENCY_COMMANDS[1];
    default:
      return undefined;
  }
}
