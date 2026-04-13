import * as vscode from 'vscode';
import { ConversionRequest, ConversionResult } from '../types/conversion';
import { DEPENDENCY_EXTENSION_ID } from '../constants/ids';
import { logger } from '../utils/logger';

export async function executeExportBridge(request: ConversionRequest): Promise<ConversionResult> {
  logger.info(`Export bridge: converting ${request.input} to ${request.targetFormat}`);

  const ext = vscode.extensions.getExtension(DEPENDENCY_EXTENSION_ID);
  if (!ext) {
    throw new Error(`Extension ${DEPENDENCY_EXTENSION_ID} not found`);
  }

  if (!ext.isActive) {
    await ext.activate();
  }

  const exports = ext.exports as Record<string, unknown>;
  if (!exports) {
    throw new Error(`Extension ${DEPENDENCY_EXTENSION_ID} has no exports`);
  }

  const convertFn = exports['convert'] ?? exports['convertImage'] ?? exports['webify'];
  if (typeof convertFn !== 'function') {
    throw new Error(`Extension ${DEPENDENCY_EXTENSION_ID} does not export a convert function`);
  }

  await convertFn({
    input: request.input,
    format: request.targetFormat,
    quality: request.quality,
    output: request.output,
  });

  return {
    success: true,
    strategy: 'export-bridge',
    input: request.input,
    output: request.output,
    targetFormat: request.targetFormat,
    quality: request.quality,
    message: `Image converted successfully via export bridge`,
  };
}
