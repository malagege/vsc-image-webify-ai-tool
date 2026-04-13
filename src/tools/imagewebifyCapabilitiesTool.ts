import * as vscode from 'vscode';
import { GetCapabilitiesToolInput } from '../types/tool';
import { detectDependency } from '../core/dependencyDetector';
import { logger } from '../utils/logger';

export class ImagewebifyCapabilitiesTool implements vscode.LanguageModelTool<GetCapabilitiesToolInput> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<GetCapabilitiesToolInput>,
    _token: vscode.CancellationToken,
  ): Promise<vscode.LanguageModelToolResult> {
    logger.info('imagewebify_get_capabilities tool invoked');

    const includeDep = options.input.includeDependencyStatus !== false;
    const depStatus = includeDep ? await detectDependency() : undefined;

    const capabilities = {
      extensionId: 'malagege.vsc-image-webify-ai-tool',
      version: '0.1.0',
      supportedInputFormats: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'],
      supportedOutputFormats: ['webp', 'avif', 'png', 'jpg', 'jpeg'],
      availableTools: ['imagewebify_convert', 'imagewebify_batch_convert', 'imagewebify_get_capabilities'],
      dependency: depStatus,
    };

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(capabilities, null, 2)),
    ]);
  }

  prepareInvocation(
    _options: vscode.LanguageModelToolInvocationPrepareOptions<GetCapabilitiesToolInput>,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.PreparedToolInvocation> {
    return {
      invocationMessage: 'Checking Image Webify AI Tool capabilities...',
    };
  }
}
