export const EXTENSION_ID = 'malagege.vsc-image-webify-ai-tool';
export const DEPENDENCY_EXTENSION_ID = 'armando-liccardo-dev.image-webify';
export const DEPENDENCY_EXTENSION_NAME = 'Image Webify';
export const DEPENDENCY_MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=armando-liccardo-dev.image-webify';

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
  'image-webify.convertToWebp',
  'image-webify.convertToAvif',
] as const;
export const DEPENDENCY_SUPPORTED_OUTPUT_FORMATS = ['webp', 'avif'] as const;

export const SUPPORTED_INPUT_FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'] as const;
export const SUPPORTED_OUTPUT_FORMATS = ['webp', 'avif', 'png', 'jpg', 'jpeg'] as const;
