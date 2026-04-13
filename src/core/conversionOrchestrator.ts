import { ConversionRequest, BatchConversionRequest, ConversionResult, BatchConversionResult, DependencyStatus } from '../types/conversion';
import { selectBridge } from '../bridges/bridgeSelector';
import { logger } from '../utils/logger';
import { ConversionError } from '../utils/errors';
import { buildOutputPath, fileExists, scanDirectory } from '../utils/path';
import * as fs from 'fs';

export async function orchestrateConversion(
  request: ConversionRequest,
  depStatus: DependencyStatus,
): Promise<ConversionResult> {
  logger.info(`Orchestrating conversion: ${request.input} -> ${request.targetFormat}`);

  if (!fileExists(request.input)) {
    return {
      success: false,
      strategy: 'fallback-bridge',
      input: request.input,
      errorCode: 'INPUT_FILE_NOT_FOUND',
      message: `Input file not found: ${request.input}`,
      recovery: [
        'Check that the input file path is correct',
        'Use an absolute path or a path relative to the workspace root',
      ],
    };
  }

  const outputPath = buildOutputPath(request.input, request.targetFormat, request.output);

  if (!request.overwrite && fileExists(outputPath)) {
    return {
      success: false,
      strategy: 'fallback-bridge',
      input: request.input,
      output: outputPath,
      errorCode: 'OUTPUT_ALREADY_EXISTS',
      message: `Output file already exists: ${outputPath}`,
      recovery: [
        'Set overwrite to true to overwrite the existing file',
        'Provide a different output path',
      ],
    };
  }

  const bridge = selectBridge(depStatus, request.targetFormat);
  logger.info(`Using bridge strategy: ${bridge.strategy}`);

  try {
    const result = await bridge.convert({
      ...request,
      output: outputPath,
    });
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const errorCode = err instanceof ConversionError ? err.code : 'CONVERSION_FAILED';
    logger.error(`Conversion failed: ${message}`);
    return {
      success: false,
      strategy: bridge.strategy,
      input: request.input,
      output: outputPath,
      errorCode,
      message,
      recovery: ['Check that the input file is a valid image', 'Try reloading VS Code'],
    };
  }
}

export async function orchestrateBatchConversion(
  request: BatchConversionRequest,
  depStatus: DependencyStatus,
): Promise<BatchConversionResult> {
  logger.info(`Orchestrating batch conversion: ${request.inputs.length} inputs -> ${request.targetFormat}`);

  const resolvedInputs = await expandInputs(request.inputs, request.recursive ?? false);

  const bridge = selectBridge(depStatus, request.targetFormat);
  const results: ConversionResult[] = [];

  for (const inputFile of resolvedInputs) {
    const outputPath = buildOutputPath(inputFile, request.targetFormat, undefined, request.outputDir);

    if (!fileExists(inputFile)) {
      results.push({
        success: false,
        strategy: bridge.strategy,
        input: inputFile,
        errorCode: 'INPUT_FILE_NOT_FOUND',
        message: `Input file not found: ${inputFile}`,
      });
      continue;
    }

    if (!request.overwrite && fileExists(outputPath)) {
      results.push({
        success: false,
        strategy: bridge.strategy,
        input: inputFile,
        output: outputPath,
        errorCode: 'OUTPUT_ALREADY_EXISTS',
        message: `Output already exists: ${outputPath}`,
      });
      continue;
    }

    try {
      const result = await bridge.convert({
        input: inputFile,
        targetFormat: request.targetFormat,
        quality: request.quality,
        output: outputPath,
        overwrite: request.overwrite,
      });
      results.push(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        success: false,
        strategy: bridge.strategy,
        input: inputFile,
        output: outputPath,
        errorCode: 'CONVERSION_FAILED',
        message,
      });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.length - succeeded;
  const allSuccess = failed === 0;

  return {
    success: allSuccess,
    strategy: bridge.strategy,
    total: results.length,
    succeeded,
    failed,
    results,
    message: allSuccess
      ? `Successfully converted ${succeeded} file(s) to ${request.targetFormat}`
      : `Converted ${succeeded}/${results.length} files. ${failed} failed.`,
  };
}

async function expandInputs(inputs: string[], recursive: boolean): Promise<string[]> {
  const files: string[] = [];
  for (const input of inputs) {
    try {
      const stat = await fs.promises.stat(input);
      if (stat.isDirectory()) {
        const dirFiles = await scanDirectory(input, recursive);
        files.push(...dirFiles);
      } else {
        files.push(input);
      }
    } catch {
      files.push(input);
    }
  }
  return files;
}
