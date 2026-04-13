import { DEPENDENCY_EXTENSION_ID, DEPENDENCY_EXTENSION_NAME, DEPENDENCY_MARKETPLACE_URL } from '../constants/ids';

export type ErrorCode =
  | 'DEPENDENCY_NOT_INSTALLED'
  | 'DEPENDENCY_NOT_ACTIVE'
  | 'NO_SUPPORTED_BRIDGE'
  | 'INPUT_FILE_NOT_FOUND'
  | 'INVALID_TARGET_FORMAT'
  | 'INVALID_QUALITY_RANGE'
  | 'OUTPUT_ALREADY_EXISTS'
  | 'CONVERSION_FAILED'
  | 'BATCH_PARTIAL_FAILURE'
  | 'INVALID_INPUT';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  DEPENDENCY_NOT_INSTALLED: `Optional extension ${DEPENDENCY_EXTENSION_ID} is not installed`,
  DEPENDENCY_NOT_ACTIVE: `Optional extension ${DEPENDENCY_EXTENSION_ID} is not active`,
  NO_SUPPORTED_BRIDGE: 'No supported bridge strategy is available for image conversion',
  INPUT_FILE_NOT_FOUND: 'Input file not found',
  INVALID_TARGET_FORMAT: 'Invalid target format. Supported: webp, avif, png, jpg, jpeg',
  INVALID_QUALITY_RANGE: 'Quality must be between 1 and 100',
  OUTPUT_ALREADY_EXISTS: 'Output file already exists and overwrite is disabled',
  CONVERSION_FAILED: 'Image conversion failed',
  BATCH_PARTIAL_FAILURE: 'Some files in the batch failed to convert',
  INVALID_INPUT: 'Invalid input parameters',
};

export const ERROR_RECOVERY: Record<ErrorCode, string[]> = {
  DEPENDENCY_NOT_INSTALLED: [
    `Install ${DEPENDENCY_EXTENSION_NAME} from the VS Code Marketplace`,
    DEPENDENCY_MARKETPLACE_URL,
    'Reload VS Code window after installation',
  ],
  DEPENDENCY_NOT_ACTIVE: [
    `Reload VS Code window to activate ${DEPENDENCY_EXTENSION_ID}`,
    'Check if the extension is enabled in the Extensions panel',
  ],
  NO_SUPPORTED_BRIDGE: [
    `Ensure ${DEPENDENCY_EXTENSION_ID} is installed and active, or use the fallback bridge`,
    'Try reloading the VS Code window',
  ],
  INPUT_FILE_NOT_FOUND: [
    'Check that the input file path is correct',
    'Use an absolute path or a path relative to the workspace root',
  ],
  INVALID_TARGET_FORMAT: [
    'Use one of the supported formats: webp, avif, png, jpg, jpeg',
  ],
  INVALID_QUALITY_RANGE: [
    'Provide a quality value between 1 and 100',
  ],
  OUTPUT_ALREADY_EXISTS: [
    'Set overwrite to true to overwrite the existing file',
    'Provide a different output path',
  ],
  CONVERSION_FAILED: [
    'Check that the input file is a valid image',
    'Try a different bridge strategy via imageWebifyAi.preferBridge setting',
  ],
  BATCH_PARTIAL_FAILURE: [
    'Check the individual results for details on which files failed',
  ],
  INVALID_INPUT: [
    'Ensure all required parameters are provided and valid',
  ],
};

export class ConversionError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message?: string,
  ) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = 'ConversionError';
  }
}
