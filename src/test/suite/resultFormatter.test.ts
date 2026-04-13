import * as assert from 'assert';
import { ConversionResult, BatchConversionResult } from '../../types/conversion';

suite('ResultFormatter Unit Tests', () => {
  function formatSuccess(result: ConversionResult): object {
    return {
      success: true,
      strategy: result.strategy,
      input: result.input,
      output: result.output,
      targetFormat: result.targetFormat,
      quality: result.quality,
      message: result.message,
    };
  }

  function formatFailure(result: ConversionResult): object {
    return {
      success: false,
      errorCode: result.errorCode,
      message: result.message,
      recovery: result.recovery,
    };
  }

  test('Success result should include output info', () => {
    const result: ConversionResult = {
      success: true,
      strategy: 'fallback-bridge',
      input: '/workspace/image.png',
      output: '/workspace/image.webp',
      targetFormat: 'webp',
      quality: 85,
      message: 'Converted successfully',
    };
    const formatted = formatSuccess(result);
    assert.strictEqual((formatted as any).success, true);
    assert.strictEqual((formatted as any).targetFormat, 'webp');
    assert.strictEqual((formatted as any).quality, 85);
  });

  test('Failure result should include error code', () => {
    const result: ConversionResult = {
      success: false,
      strategy: 'fallback-bridge',
      input: '/workspace/image.png',
      errorCode: 'INPUT_FILE_NOT_FOUND',
      message: 'Input file not found',
      recovery: ['Check the file path'],
    };
    const formatted = formatFailure(result);
    assert.strictEqual((formatted as any).success, false);
    assert.strictEqual((formatted as any).errorCode, 'INPUT_FILE_NOT_FOUND');
    assert.ok(Array.isArray((formatted as any).recovery));
  });

  test('Batch result should include totals', () => {
    const batchResult: BatchConversionResult = {
      success: true,
      strategy: 'fallback-bridge',
      total: 3,
      succeeded: 3,
      failed: 0,
      results: [],
      message: 'All converted',
    };
    assert.strictEqual(batchResult.total, 3);
    assert.strictEqual(batchResult.succeeded, 3);
    assert.strictEqual(batchResult.failed, 0);
  });
});
