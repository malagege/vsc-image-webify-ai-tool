import { ConversionResult, BatchConversionResult } from '../types/conversion';
import { getRelativePath } from '../utils/workspace';

export function formatConversionResult(result: ConversionResult): string {
  if (result.success) {
    const inputRel = getRelativePath(result.input);
    const outputRel = result.output ? getRelativePath(result.output) : 'unknown';
    return JSON.stringify({
      success: true,
      strategy: result.strategy,
      input: inputRel,
      output: outputRel,
      targetFormat: result.targetFormat,
      quality: result.quality,
      message: result.message,
    }, null, 2);
  } else {
    return JSON.stringify({
      success: false,
      errorCode: result.errorCode,
      message: result.message,
      recovery: result.recovery,
    }, null, 2);
  }
}

export function formatBatchResult(result: BatchConversionResult): string {
  const summary = {
    success: result.success,
    strategy: result.strategy,
    total: result.total,
    succeeded: result.succeeded,
    failed: result.failed,
    message: result.message,
    results: result.results.map(r => ({
      success: r.success,
      input: getRelativePath(r.input),
      output: r.output ? getRelativePath(r.output) : undefined,
      errorCode: r.errorCode,
      message: r.message,
    })),
  };
  return JSON.stringify(summary, null, 2);
}
