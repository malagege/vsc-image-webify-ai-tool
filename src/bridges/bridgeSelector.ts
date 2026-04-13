import { ConversionRequest, ConversionResult, BridgeStrategy, DependencyStatus } from '../types/conversion';
import { executeCommandBridge } from './commandBridge';
import { executeExportBridge } from './exportBridge';
import { executeFallbackBridge } from './fallbackBridge';
import { getConfig } from '../utils/workspace';
import { logger } from '../utils/logger';

export interface Bridge {
  strategy: BridgeStrategy;
  convert(request: ConversionRequest): Promise<ConversionResult>;
}

export function selectBridge(depStatus: DependencyStatus): Bridge {
  const preferBridge = getConfig<string>('preferBridge', 'auto');

  if (preferBridge === 'command' || (preferBridge === 'auto' && depStatus.recommendedStrategy === 'command-bridge')) {
    if (depStatus.availableCommands.length > 0) {
      logger.info('Selected bridge: command-bridge');
      return { strategy: 'command-bridge', convert: executeCommandBridge };
    }
  }

  if (preferBridge === 'export' || (preferBridge === 'auto' && depStatus.recommendedStrategy === 'export-bridge')) {
    if (depStatus.hasExports) {
      logger.info('Selected bridge: export-bridge');
      return { strategy: 'export-bridge', convert: executeExportBridge };
    }
  }

  logger.info('Selected bridge: fallback-bridge');
  return { strategy: 'fallback-bridge', convert: executeFallbackBridge };
}
