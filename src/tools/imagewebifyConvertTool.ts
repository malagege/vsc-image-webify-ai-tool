import * as vscode from 'vscode';
import { ConvertToolInput } from '../types/tool';
import { parseConvertRequest } from '../core/requestParser';
import { orchestrateConversion } from '../core/conversionOrchestrator';
import { formatConversionResult } from '../core/resultFormatter';
import { detectDependency } from '../core/dependencyDetector';
import { logger } from '../utils/logger';
import { ConversionError } from '../utils/errors';

export class ImagewebifyConvertTool implements vscode.LanguageModelTool<ConvertToolInput> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ConvertToolInput>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    logger.info('imagewebify_convert tool invoked', options.input);

    try {
      const request = parseConvertRequest(options.input);
      const depStatus = await detectDependency();
      const result = await orchestrateConversion(request, depStatus);
      const formatted = formatConversionResult(result);

      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(formatted),
      ]);
    } catch (err) {
      const code = err instanceof ConversionError ? err.code : 'CONVERSION_FAILED';
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`imagewebify_convert tool error: ${message}`);
      const errorResult = JSON.stringify({ success: false, errorCode: code, message }, null, 2);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(errorResult),
      ]);
    }
  }

  prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ConvertToolInput>,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.PreparedToolInvocation> {
    const input = options.input;
    return {
      invocationMessage: `Converting ${input.input} to ${input.targetFormat}...`,
      confirmationMessages: undefined,
    };
  }
}
