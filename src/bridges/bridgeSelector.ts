import { ConversionRequest, ConversionResult, BridgeStrategy, DependencyStatus } from '../types/conversion';
import { DEPENDENCY_SUPPORTED_OUTPUT_FORMATS } from '../constants/ids';
import { executeCommandBridge } from './commandBridge';
import { executeExportBridge } from './exportBridge';
import { executeFallbackBridge } from './fallbackBridge';
import { getConfig } from '../utils/workspace';
import { logger } from '../utils/logger';

export interface Bridge {
  strategy: BridgeStrategy;
  convert(request: ConversionRequest): Promise<ConversionResult>;
}

export function selectBridge(depStatus: DependencyStatus, targetFormat?: string): Bridge {
  const preferBridge = getConfig<string>('preferBridge', 'auto');
  const dependencySupportsTarget = targetFormat == null || supportsDependencyTarget(targetFormat);

  if (
    dependencySupportsTarget
    && (preferBridge === 'command' || (preferBridge === 'auto' && depStatus.recommendedStrategy === 'command-bridge'))
  ) {
    if (depStatus.availableCommands.length > 0) {
      logger.info('Selected bridge: command-bridge');
      return { strategy: 'command-bridge', convert: executeCommandBridge };
    }
  }

  if (
    dependencySupportsTarget
    && (preferBridge === 'export' || (preferBridge === 'auto' && depStatus.recommendedStrategy === 'export-bridge'))
  ) {
    if (depStatus.hasExports) {
      logger.info('Selected bridge: export-bridge');
      return { strategy: 'export-bridge', convert: executeExportBridge };
    }
  }

  logger.info('Selected bridge: fallback-bridge');
  return { strategy: 'fallback-bridge', convert: executeFallbackBridge };
}

function supportsDependencyTarget(targetFormat: string): boolean {
  return DEPENDENCY_SUPPORTED_OUTPUT_FORMATS.includes(
    targetFormat as (typeof DEPENDENCY_SUPPORTED_OUTPUT_FORMATS)[number],
  );
}
