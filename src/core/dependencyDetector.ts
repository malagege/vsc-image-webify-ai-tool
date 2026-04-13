import * as vscode from 'vscode';
import { DEPENDENCY_EXTENSION_ID, KNOWN_DEPENDENCY_COMMANDS } from '../constants/ids';
import { DependencyStatus, BridgeStrategy } from '../types/conversion';
import { logger } from '../utils/logger';

export async function detectDependency(): Promise<DependencyStatus> {
  const ext = vscode.extensions.getExtension(DEPENDENCY_EXTENSION_ID);

  if (!ext) {
    logger.warn(`Dependency extension ${DEPENDENCY_EXTENSION_ID} is not installed`);
    return {
      extensionInstalled: false,
      extensionActive: false,
      extensionId: DEPENDENCY_EXTENSION_ID,
      availableCommands: [],
      hasExports: false,
      recommendedStrategy: 'fallback-bridge',
    };
  }

  let extensionActive = ext.isActive;
  if (!extensionActive) {
    try {
      await ext.activate();
      extensionActive = true;
      logger.info(`Activated dependency extension ${DEPENDENCY_EXTENSION_ID}`);
    } catch (err) {
      logger.warn(`Failed to activate dependency extension: ${err}`);
    }
  }

  const hasExports = extensionActive && ext.exports != null && Object.keys(ext.exports).length > 0;

  const availableCommands = await detectAvailableCommands();

  const recommendedStrategy = determineStrategy(extensionActive, hasExports, availableCommands);

  logger.info(`Dependency status: installed=true, active=${extensionActive}, exports=${hasExports}, commands=${availableCommands.length}, strategy=${recommendedStrategy}`);

  return {
    extensionInstalled: true,
    extensionActive,
    extensionId: DEPENDENCY_EXTENSION_ID,
    availableCommands,
    hasExports,
    recommendedStrategy,
  };
}

async function detectAvailableCommands(): Promise<string[]> {
  try {
    const allCommands = await vscode.commands.getCommands(true);
    const found = KNOWN_DEPENDENCY_COMMANDS.filter(cmd => allCommands.includes(cmd));
    logger.debug(`Found dependency commands: ${found.join(', ')}`);
    return found;
  } catch (err) {
    logger.warn(`Failed to detect dependency commands: ${err}`);
    return [];
  }
}

function determineStrategy(
  active: boolean,
  hasExports: boolean,
  availableCommands: string[],
): BridgeStrategy {
  if (active && availableCommands.length > 0) {
    return 'command-bridge';
  }
  if (active && hasExports) {
    return 'export-bridge';
  }
  return 'fallback-bridge';
}
