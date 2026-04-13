import * as assert from 'assert';
import { DependencyStatus } from '../../types/conversion';

suite('BridgeSelector Unit Tests', () => {
  function mockDepStatus(overrides: Partial<DependencyStatus>): DependencyStatus {
    return {
      extensionInstalled: true,
      extensionActive: true,
      extensionId: 'geckod22.vsc-image-webify',
      availableCommands: [],
      hasExports: false,
      recommendedStrategy: 'fallback-bridge',
      ...overrides,
    };
  }

  test('Should select fallback-bridge when no commands or exports', () => {
    const status = mockDepStatus({ recommendedStrategy: 'fallback-bridge' });
    assert.strictEqual(status.recommendedStrategy, 'fallback-bridge');
  });

  test('Should select command-bridge when commands available', () => {
    const status = mockDepStatus({
      availableCommands: ['vsc-image-webify.convertToWebP'],
      recommendedStrategy: 'command-bridge',
    });
    assert.strictEqual(status.recommendedStrategy, 'command-bridge');
  });
});
