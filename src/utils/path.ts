import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SupportedOutputFormat } from '../types/conversion';

export function resolveInputPath(inputPath: string): string {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return path.join(workspaceFolders[0].uri.fsPath, inputPath);
  }
  return path.resolve(inputPath);
}

export function buildOutputPath(
  inputPath: string,
  targetFormat: SupportedOutputFormat,
  outputPath?: string,
  outputDir?: string,
): string {
  if (outputPath) {
    return outputPath;
  }
  const ext = `.${targetFormat}`;
  const basename = path.basename(inputPath, path.extname(inputPath));
  const dir = outputDir ?? path.dirname(inputPath);
  return path.join(dir, `${basename}${ext}`);
}

export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase().replace('.', '');
}

export function isImageFile(filePath: string): boolean {
  const supportedExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'avif'];
  return supportedExts.includes(getFileExtension(filePath));
}

export async function scanDirectory(
  dirPath: string,
  recursive: boolean,
): Promise<string[]> {
  const results: string[] = [];

  async function scan(dir: string): Promise<void> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && recursive) {
        await scan(fullPath);
      } else if (entry.isFile() && isImageFile(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  await scan(dirPath);
  return results;
}
