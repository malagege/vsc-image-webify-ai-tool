import * as vscode from 'vscode';
import { ConversionRequest, ConversionResult } from '../types/conversion';
import { logger } from '../utils/logger';

export async function executeCommandBridge(request: ConversionRequest): Promise<ConversionResult> {
  logger.info(`Command bridge: converting ${request.input} to ${request.targetFormat}`);

  const commandsToTry = [
    `vsc-image-webify.convertTo${capitalize(request.targetFormat)}`,
    'vsc-image-webify.convert',
  ];

  for (const command of commandsToTry) {
    try {
      const allCommands = await vscode.commands.getCommands(true);
      if (!allCommands.includes(command)) continue;

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
  }

  throw new Error('No available command bridge succeeded');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
