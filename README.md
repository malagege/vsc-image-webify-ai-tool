# Image Webify AI Tool

A VS Code extension that bridges [`armando-liccardo-dev.image-webify`](https://marketplace.visualstudio.com/items?itemName=armando-liccardo-dev.image-webify) with VS Code's **Language Model Tools API** (Copilot Chat), enabling image format conversion via natural language AI commands.

## Features

- 🤖 **AI-native**: Convert images by asking Copilot Chat naturally
- 🔄 **Three bridge strategies**: Uses vsc-image-webify commands, its export API, or falls back to `sharp`
- 📦 **Batch conversion**: Convert entire directories with a single prompt
- 🩺 **Doctor command**: Diagnose dependency status
- ⚙️ **Configurable**: Quality, format, overwrite, bridge preference

## Requirements

- VS Code **^1.95.0** (Language Model Tools API support)
- [`armando-liccardo-dev.image-webify`](https://marketplace.visualstudio.com/items?itemName=armando-liccardo-dev.image-webify) *(recommended but not strictly required — fallback uses `sharp`)*
- GitHub Copilot Chat

## Usage

### Via Copilot Chat

Ask Copilot to convert images using natural language:

```
@workspace Convert images/logo.png to webp format
```

```
@workspace Batch convert all PNG files in the assets/ folder to avif with quality 90
```

```
@workspace What image conversion capabilities are available?
```

### Via Command Palette

- **Image Webify AI: Convert Image** — Open file picker, select format and quality
- **Image Webify AI: Doctor (Check Dependencies)** — Check extension and bridge status

## AI Tools Registered

| Tool | Description |
|------|-------------|
| `imagewebify_convert` | Convert a single image file |
| `imagewebify_batch_convert` | Convert multiple files or a directory |
| `imagewebify_get_capabilities` | Get capabilities and dependency status |

## Supported Formats

| Direction | Formats |
|-----------|---------|
| Input | `png`, `jpg`, `jpeg`, `gif`, `bmp`, `tiff`, `webp` |
| Output | `webp`, `avif`, `png`, `jpg`, `jpeg` |

## Configuration

```jsonc
{
  // Bridge strategy: auto, command, export, fallback
  "imageWebifyAi.preferBridge": "auto",

  // Default quality (1-100)
  "imageWebifyAi.defaultQuality": 85,

  // Default output format
  "imageWebifyAi.defaultOutputFormat": "webp",

  // Overwrite existing files by default
  "imageWebifyAi.overwriteByDefault": false,

  // Enable batch conversion tool
  "imageWebifyAi.enableBatchTool": true,

  // Log level: debug, info, warn, error
  "imageWebifyAi.logLevel": "info"
}
```

## Bridge Strategy

The extension automatically selects the best conversion strategy:

1. **Command Bridge** — Delegates to `vsc-image-webify` registered commands (best integration)
2. **Export Bridge** — Calls `vsc-image-webify`'s exported API directly
3. **Fallback Bridge** — Uses [`sharp`](https://sharp.pixelplumbing.com/) (no dependency required)

See [docs/fallback-strategy.md](docs/fallback-strategy.md) for details.

## Development

```bash
npm install
npm run build:dev   # dev build with source maps
npm run watch       # watch mode
npm run compile     # type check only
npm test            # run tests
```

See [docs/architecture.md](docs/architecture.md) for architecture details.

## License

MIT
