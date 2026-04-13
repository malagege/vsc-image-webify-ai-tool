import { ConversionRequest, BatchConversionRequest, SupportedOutputFormat } from '../types/conversion';
import { ConvertToolInput, BatchConvertToolInput } from '../types/tool';
import { ConversionError } from '../utils/errors';
import { resolveInputPath } from '../utils/path';
import { getConfig } from '../utils/workspace';
import { SUPPORTED_OUTPUT_FORMATS } from '../constants/ids';

export function parseConvertRequest(input: ConvertToolInput): ConversionRequest {
  validateFormat(input.targetFormat);
  validateQuality(input.quality);

  const resolvedInput = resolveInputPath(input.input);

  const quality = input.quality ?? getConfig<number>('defaultQuality', 85);
  const overwrite = input.overwrite ?? getConfig<boolean>('overwriteByDefault', false);

  return {
    input: resolvedInput,
    targetFormat: input.targetFormat,
    quality,
    output: input.output,
    overwrite,
  };
}

export function parseBatchConvertRequest(input: BatchConvertToolInput): BatchConversionRequest {
  validateFormat(input.targetFormat);
  validateQuality(input.quality);

  if (!input.inputs || input.inputs.length === 0) {
    throw new ConversionError('INVALID_INPUT', 'At least one input path is required');
  }

  const resolvedInputs = input.inputs.map(resolveInputPath);

  const quality = input.quality ?? getConfig<number>('defaultQuality', 85);
  const overwrite = input.overwrite ?? getConfig<boolean>('overwriteByDefault', false);

  return {
    inputs: resolvedInputs,
    targetFormat: input.targetFormat,
    quality,
    outputDir: input.outputDir,
    recursive: input.recursive ?? false,
    overwrite,
  };
}

function validateFormat(format: string): asserts format is SupportedOutputFormat {
  if (!SUPPORTED_OUTPUT_FORMATS.includes(format as SupportedOutputFormat)) {
    throw new ConversionError(
      'INVALID_TARGET_FORMAT',
      `Invalid format "${format}". Supported: ${SUPPORTED_OUTPUT_FORMATS.join(', ')}`,
    );
  }
}

function validateQuality(quality?: number): void {
  if (quality !== undefined && (quality < 1 || quality > 100)) {
    throw new ConversionError('INVALID_QUALITY_RANGE', `Quality ${quality} is out of range (1-100)`);
  }
}
