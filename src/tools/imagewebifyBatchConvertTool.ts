import * as vscode from 'vscode';
import { BatchConvertToolInput } from '../types/tool';
import { parseBatchConvertRequest } from '../core/requestParser';
import { orchestrateBatchConversion } from '../core/conversionOrchestrator';
import { formatBatchResult } from '../core/resultFormatter';
import { detectDependency } from '../core/dependencyDetector';
import { logger } from '../utils/logger';
import { ConversionError } from '../utils/errors';

export class ImagewebifyBatchConvertTool implements vscode.LanguageModelTool<BatchConvertToolInput> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<BatchConvertToolInput>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    logger.info('imagewebify_batch_convert tool invoked', options.input);

    try {
      const request = parseBatchConvertRequest(options.input);
      const depStatus = await detectDependency();
      const result = await orchestrateBatchConversion(request, depStatus);
      const formatted = formatBatchResult(result);

      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(formatted),
      ]);
    } catch (err) {
      const code = err instanceof ConversionError ? err.code : 'CONVERSION_FAILED';
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`imagewebify_batch_convert tool error: ${message}`);
      const errorResult = JSON.stringify({ success: false, errorCode: code, message }, null, 2);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(errorResult),
      ]);
    }
  }

  prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<BatchConvertToolInput>,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.PreparedToolInvocation> {
    const count = options.input.inputs?.length ?? 0;
    return {
      invocationMessage: `Batch converting ${count} file(s) to ${options.input.targetFormat}...`,
    };
  }
}
