import * as vscode from 'vscode';
import { ImagewebifyConvertTool } from './imagewebifyConvertTool';
import { ImagewebifyBatchConvertTool } from './imagewebifyBatchConvertTool';
import { ImagewebifyCapabilitiesTool } from './imagewebifyCapabilitiesTool';
import { TOOL_NAMES } from '../constants/ids';
import { logger } from '../utils/logger';
import { getConfig } from '../utils/workspace';

export function registerTools(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.lm.registerTool(TOOL_NAMES.CONVERT, new ImagewebifyConvertTool()),
  );
  logger.info(`Registered tool: ${TOOL_NAMES.CONVERT}`);

  if (getConfig<boolean>('enableBatchTool', true)) {
    context.subscriptions.push(
      vscode.lm.registerTool(TOOL_NAMES.BATCH_CONVERT, new ImagewebifyBatchConvertTool()),
    );
    logger.info(`Registered tool: ${TOOL_NAMES.BATCH_CONVERT}`);
  }

  context.subscriptions.push(
    vscode.lm.registerTool(TOOL_NAMES.GET_CAPABILITIES, new ImagewebifyCapabilitiesTool()),
  );
  logger.info(`Registered tool: ${TOOL_NAMES.GET_CAPABILITIES}`);
}
