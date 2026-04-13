import * as vscode from 'vscode';
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
    lines.push('', '⚠️  Action Required:');
    lines.push('   Install geckod22.vsc-image-webify from VS Code Marketplace');
    lines.push('   Then reload VS Code window');
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
      : `❌ Dependency NOT installed: geckod22.vsc-image-webify`,
  );
}
