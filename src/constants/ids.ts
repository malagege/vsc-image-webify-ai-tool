export const EXTENSION_ID = 'malagege.vsc-image-webify-ai-tool';
export const DEPENDENCY_EXTENSION_ID = 'geckod22.vsc-image-webify';

export const COMMANDS = {
  CONVERT_IMAGE: 'vsc-image-webify-ai-tool.convertImage',
  DOCTOR: 'vsc-image-webify-ai-tool.doctor',
} as const;

export const TOOL_NAMES = {
  CONVERT: 'imagewebify_convert',
  BATCH_CONVERT: 'imagewebify_batch_convert',
  GET_CAPABILITIES: 'imagewebify_get_capabilities',
} as const;

export const KNOWN_DEPENDENCY_COMMANDS = [
  'vsc-image-webify.convertToWebP',
  'vsc-image-webify.convertToAvif',
  'vsc-image-webify.convert',
] as const;

export const SUPPORTED_INPUT_FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'] as const;
export const SUPPORTED_OUTPUT_FORMATS = ['webp', 'avif', 'png', 'jpg', 'jpeg'] as const;
