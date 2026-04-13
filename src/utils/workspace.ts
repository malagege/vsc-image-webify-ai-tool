import * as vscode from 'vscode';
import * as path from 'path';

export function getWorkspaceRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  return folders && folders.length > 0 ? folders[0].uri.fsPath : undefined;
}

export function getRelativePath(absolutePath: string): string {
  const root = getWorkspaceRoot();
  if (root && absolutePath.startsWith(root)) {
    return path.relative(root, absolutePath);
  }
  return absolutePath;
}

export function getConfig<T>(key: string, defaultValue: T): T {
  const config = vscode.workspace.getConfiguration('imageWebifyAi');
  return config.get<T>(key, defaultValue);
}
