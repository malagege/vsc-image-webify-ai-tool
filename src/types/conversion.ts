export type SupportedInputFormat = 'png' | 'jpg' | 'jpeg' | 'gif' | 'bmp' | 'tiff' | 'webp';
export type SupportedOutputFormat = 'webp' | 'avif' | 'png' | 'jpg' | 'jpeg';
export type BridgeStrategy = 'command-bridge' | 'export-bridge' | 'fallback-bridge';

export interface ConversionRequest {
  input: string;
  targetFormat: SupportedOutputFormat;
  quality?: number;
  output?: string;
  overwrite?: boolean;
  recursive?: boolean;
}

export interface BatchConversionRequest {
  inputs: string[];
  targetFormat: SupportedOutputFormat;
  quality?: number;
  outputDir?: string;
  recursive?: boolean;
  overwrite?: boolean;
}

export interface ConversionResult {
  success: boolean;
  strategy: BridgeStrategy;
  input: string;
  output?: string;
  targetFormat?: string;
  quality?: number;
  errorCode?: string;
  message: string;
  recovery?: string[];
}

export interface BatchConversionResult {
  success: boolean;
  strategy: BridgeStrategy;
  total: number;
  succeeded: number;
  failed: number;
  results: ConversionResult[];
  message: string;
}

export interface DependencyStatus {
  extensionInstalled: boolean;
  extensionActive: boolean;
  extensionId: string;
  availableCommands: string[];
  hasExports: boolean;
  recommendedStrategy: BridgeStrategy;
}
