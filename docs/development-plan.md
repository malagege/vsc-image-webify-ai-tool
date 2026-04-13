# Development Plan

## Goals

Build a VS Code extension that:
1. Exposes image conversion as Language Model Tools for Copilot Chat
2. Bridges `geckod22.vsc-image-webify` when available
3. Falls back to `sharp` for standalone conversion
4. Provides a rich, reliable developer experience

## Milestones

### v0.1.0 - Foundation (Current)
- [x] Extension scaffolding with TypeScript + esbuild
- [x] Three LM Tools: `imagewebify_convert`, `imagewebify_batch_convert`, `imagewebify_get_capabilities`
- [x] Three bridge strategies: command, export, fallback (sharp)
- [x] Bridge auto-selection via dependency detection
- [x] VS Code commands: Convert Image, Doctor
- [x] Structured error handling with recovery suggestions
- [x] Unit test suite

### v0.2.0 - Enhanced Integration
- [ ] Probe actual vsc-image-webify command signatures via runtime introspection
- [ ] Support `outputDir` per-extension configuration mapping
- [ ] Progress reporting for batch conversions
- [ ] Cancellation token support in tool `invoke`

### v0.3.0 - Extended Formats
- [ ] Support additional input formats (heic, tga, raw)
- [ ] Resize/transform options in conversion request
- [ ] Strip metadata option (EXIF removal)

### v1.0.0 - Stable Release
- [ ] End-to-end tests with vsc-image-webify installed
- [ ] VS Code Marketplace listing
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Telemetry (opt-in)

## Development Setup

```bash
# Install dependencies
npm install

# Build (dev mode with source maps)
npm run build:dev

# Watch mode
npm run watch

# Type check
npm run compile

# Run tests
npm test
```

## Testing Strategy

- **Unit tests** (`src/test/suite/*.test.ts`): Test pure logic without VS Code dependencies
- **Integration tests**: Test with actual VS Code instance via `@vscode/test-electron`
- **Manual testing**: Use the Command Palette commands to test the full flow

## Key Design Decisions

1. **esbuild over webpack**: Faster builds, simpler config, good tree-shaking
2. **sharp as fallback**: Cross-platform, well-maintained, no native build issues in modern versions
3. **Structured JSON output from tools**: Allows Copilot to parse and reason about results
4. **Bridge pattern**: Decouples conversion logic from the specific vsc-image-webify API
5. **Lazy dependency detection**: Detected at activation and on each tool call to handle extension reload
