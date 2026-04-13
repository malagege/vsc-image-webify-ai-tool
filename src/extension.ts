import * as vscode from 'vscode';
import { COMMANDS } from './constants/ids';
import { registerTools } from './tools/registerTools';
import { convertImageCommand } from './commands/convertImageCommand';
import { doctorCommand } from './commands/doctorCommand';
import { detectDependency } from './core/dependencyDetector';
import { logger } from './utils/logger';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  logger.info('vsc-image-webify-ai-tool activating...');

  const depStatus = await detectDependency();

  if (!depStatus.extensionInstalled || !depStatus.extensionActive) {
    logger.warn(
      `Dependency extension ${depStatus.extensionId} is ${
        !depStatus.extensionInstalled ? 'not installed' : 'not active'
      }. Fallback bridge will be used.`,
    );
  }

  registerTools(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMANDS.CONVERT_IMAGE, () =>
      convertImageCommand(depStatus),
    ),
    vscode.commands.registerCommand(COMMANDS.DOCTOR, doctorCommand),
  );

  logger.info('vsc-image-webify-ai-tool activated successfully');
}

export function deactivate(): void {
  logger.info('vsc-image-webify-ai-tool deactivated');
  logger.dispose();
}
