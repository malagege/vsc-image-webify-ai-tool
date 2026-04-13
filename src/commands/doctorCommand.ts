import * as vscode from 'vscode';
import {
  DEPENDENCY_EXTENSION_ID,
  DEPENDENCY_EXTENSION_NAME,
  DEPENDENCY_MARKETPLACE_URL,
} from '../constants/ids';
import { detectDependency } from '../core/dependencyDetector';
import { logger } from '../utils/logger';

export async function doctorCommand(): Promise<void> {
  logger.show();

  const depStatus = await detectDependency();

  const lines: string[] = [
    '🩺 Image Webify AI Tool - Diagnostics',
    '',
    `Dependency Extension: ${depStatus.extensionId}`,
    `  Installed: ${depStatus.extensionInstalled ? '✅' : '❌'}`,
    `  Active:    ${depStatus.extensionActive ? '✅' : '❌'}`,
    `  Has Exports: ${depStatus.hasExports ? '✅' : '❌'}`,
    `  Available Commands: ${depStatus.availableCommands.length > 0 ? depStatus.availableCommands.join(', ') : 'none'}`,
    `  Recommended Strategy: ${depStatus.recommendedStrategy}`,
  ];

  if (!depStatus.extensionInstalled) {
    lines.push('', 'ℹ️  Optional Dependency:');
    lines.push(`   Install ${DEPENDENCY_EXTENSION_NAME} from VS Code Marketplace for command/export bridging`);
    lines.push(`   ${DEPENDENCY_MARKETPLACE_URL}`);
    lines.push('   Otherwise the built-in sharp fallback bridge will be used');
  } else if (!depStatus.extensionActive) {
    lines.push('', '⚠️  Action Required:');
    lines.push('   Reload VS Code window to activate the dependency extension');
  } else if (depStatus.recommendedStrategy === 'fallback-bridge') {
    lines.push('', 'ℹ️  Using fallback bridge (sharp) for image conversion');
    lines.push('   The dependency extension is active but no compatible bridge was found');
  }

  const message = lines.join('\n');
  logger.info(message);
  vscode.window.showInformationMessage(
    depStatus.extensionInstalled
      ? `✅ Dependency OK (Strategy: ${depStatus.recommendedStrategy})`
      : `ℹ️ Optional dependency not installed: ${DEPENDENCY_EXTENSION_ID} (using fallback-bridge)`,
  );
}
