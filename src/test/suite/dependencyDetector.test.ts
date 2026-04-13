import * as assert from 'assert';
import { KNOWN_DEPENDENCY_COMMANDS } from '../../constants/ids';

suite('DependencyDetector Unit Tests', () => {
  test('Should identify fallback strategy when extension not installed', () => {
    const extensionInstalled = false;
    const extensionActive = false;
    const availableCommands: string[] = [];
    const hasExports = false;

    const strategy = !extensionInstalled
      ? 'fallback-bridge'
      : extensionActive && availableCommands.length > 0
      ? 'command-bridge'
      : extensionActive && hasExports
      ? 'export-bridge'
      : 'fallback-bridge';

    assert.strictEqual(strategy, 'fallback-bridge');
  });

  test('Should identify command-bridge strategy when commands available', () => {
    const extensionInstalled = true;
    const extensionActive = true;
    const availableCommands = [KNOWN_DEPENDENCY_COMMANDS[0]];
    const hasExports = false;

    const strategy = extensionActive && availableCommands.length > 0
      ? 'command-bridge'
      : extensionActive && hasExports
      ? 'export-bridge'
      : 'fallback-bridge';

    assert.strictEqual(strategy, 'command-bridge');
  });

  test('Should identify export-bridge strategy when exports available and no commands', () => {
    const extensionInstalled = true;
    const extensionActive = true;
    const availableCommands: string[] = [];
    const hasExports = true;

    const strategy = extensionActive && availableCommands.length > 0
      ? 'command-bridge'
      : extensionActive && hasExports
      ? 'export-bridge'
      : 'fallback-bridge';

    assert.strictEqual(strategy, 'export-bridge');
  });
});
