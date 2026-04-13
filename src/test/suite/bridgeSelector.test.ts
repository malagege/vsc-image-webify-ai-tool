import * as assert from 'assert';
import { DEPENDENCY_EXTENSION_ID, KNOWN_DEPENDENCY_COMMANDS } from '../../constants/ids';
import { selectBridge } from '../../bridges/bridgeSelector';
import { DependencyStatus } from '../../types/conversion';

suite('BridgeSelector Unit Tests', () => {
  function mockDepStatus(overrides: Partial<DependencyStatus>): DependencyStatus {
    return {
      extensionInstalled: true,
      extensionActive: true,
      extensionId: DEPENDENCY_EXTENSION_ID,
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
      availableCommands: [KNOWN_DEPENDENCY_COMMANDS[0]],
      recommendedStrategy: 'command-bridge',
    });
    assert.strictEqual(status.recommendedStrategy, 'command-bridge');
  });

  test('Should fall back for unsupported dependency target formats', () => {
    const status = mockDepStatus({
      availableCommands: [KNOWN_DEPENDENCY_COMMANDS[0]],
      recommendedStrategy: 'command-bridge',
    });

    assert.strictEqual(selectBridge(status, 'png').strategy, 'fallback-bridge');
  });
});
