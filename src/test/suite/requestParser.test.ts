import * as assert from 'assert';

suite('RequestParser Unit Tests', () => {
  test('validateFormat: valid formats should not throw', () => {
    const validFormats = ['webp', 'avif', 'png', 'jpg', 'jpeg'];
    for (const fmt of validFormats) {
      assert.ok(validFormats.includes(fmt), `${fmt} should be valid`);
    }
  });

  test('validateFormat: invalid format should be detected', () => {
    const invalidFormats = ['gif', 'bmp', 'tiff', 'heic', ''];
    const supportedOutputFormats = ['webp', 'avif', 'png', 'jpg', 'jpeg'];
    for (const fmt of invalidFormats) {
      assert.ok(!supportedOutputFormats.includes(fmt), `${fmt} should not be valid output format`);
    }
  });

  test('validateQuality: valid quality range', () => {
    const validQualities = [1, 50, 85, 100];
    for (const q of validQualities) {
      assert.ok(q >= 1 && q <= 100, `${q} should be valid`);
    }
  });

  test('validateQuality: invalid quality range', () => {
    const invalidQualities = [0, 101, -1, 200];
    for (const q of invalidQualities) {
      assert.ok(q < 1 || q > 100, `${q} should be invalid`);
    }
  });
});
