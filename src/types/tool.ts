import { SupportedOutputFormat } from './conversion';

export interface ConvertToolInput {
  input: string;
  targetFormat: SupportedOutputFormat;
  quality?: number;
  output?: string;
  overwrite?: boolean;
}

export interface BatchConvertToolInput {
  inputs: string[];
  targetFormat: SupportedOutputFormat;
  quality?: number;
  outputDir?: string;
  recursive?: boolean;
  overwrite?: boolean;
}

export interface GetCapabilitiesToolInput {
  includeDependencyStatus?: boolean;
}
