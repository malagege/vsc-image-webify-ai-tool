import { ConversionRequest, ConversionResult } from '../types/conversion';
import { logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs';

export async function executeFallbackBridge(request: ConversionRequest): Promise<ConversionResult> {
  logger.info(`Fallback bridge: converting ${request.input} to ${request.targetFormat}`);

  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    throw new Error(`Failed to load sharp for fallback conversion: ${err}`);
  }

  const outputPath = request.output!;

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const quality = request.quality ?? 85;
  let pipeline = sharp(request.input);

  switch (request.targetFormat) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'png':
      pipeline = pipeline.png();
      break;
    case 'jpg':
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    default:
      throw new Error(`Unsupported target format: ${request.targetFormat}`);
  }

  await pipeline.toFile(outputPath);

  logger.info(`Fallback bridge: converted to ${outputPath}`);

  return {
    success: true,
    strategy: 'fallback-bridge',
    input: request.input,
    output: outputPath,
    targetFormat: request.targetFormat,
    quality,
    message: `Image converted successfully via fallback bridge (sharp)`,
  };
}
