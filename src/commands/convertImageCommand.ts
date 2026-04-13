import * as vscode from 'vscode';
import { DependencyStatus } from '../types/conversion';
import { parseConvertRequest } from '../core/requestParser';
import { orchestrateConversion } from '../core/conversionOrchestrator';
import { formatConversionResult } from '../core/resultFormatter';
import { logger } from '../utils/logger';
import { getConfig } from '../utils/workspace';
import { SUPPORTED_OUTPUT_FORMATS } from '../constants/ids';

export async function convertImageCommand(depStatus: DependencyStatus): Promise<void> {
  const uris = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: { Images: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'] },
    openLabel: 'Select Image to Convert',
  });

  if (!uris || uris.length === 0) return;

  const inputPath = uris[0].fsPath;

  const targetFormat = await vscode.window.showQuickPick(
    [...SUPPORTED_OUTPUT_FORMATS],
    { placeHolder: 'Select target format' },
  );

  if (!targetFormat) return;

  const qualityStr = await vscode.window.showInputBox({
    prompt: 'Enter quality (1-100)',
    value: String(getConfig<number>('defaultQuality', 85)),
    validateInput: v => {
      const n = parseInt(v);
      return isNaN(n) || n < 1 || n > 100 ? 'Enter a number between 1 and 100' : null;
    },
  });

  if (!qualityStr) return;

  const request = parseConvertRequest({
    input: inputPath,
    targetFormat: targetFormat as any,
    quality: parseInt(qualityStr),
  });

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Converting ${inputPath} to ${targetFormat}...`,
      cancellable: false,
    },
    async () => {
      const result = await orchestrateConversion(request, depStatus);
      if (result.success) {
        vscode.window.showInformationMessage(
          `✅ Converted: ${result.output}`,
          'Open File',
        ).then(action => {
          if (action === 'Open File' && result.output) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.file(result.output));
          }
        });
      } else {
        vscode.window.showErrorMessage(`❌ Conversion failed: ${result.message}`);
      }
      logger.info(formatConversionResult(result));
    },
  );
}
