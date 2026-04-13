# Architecture

## Overview

`vsc-image-webify-ai-tool` is a VS Code extension that exposes image conversion capabilities as Language Model Tools (LM Tools / AI Tools), bridging the `geckod22.vsc-image-webify` extension with GitHub Copilot Chat.

## Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                  VS Code / Copilot Chat              │
│                                                     │
│  User: "Convert logo.png to webp"                   │
│           │                                         │
│           ▼                                         │
│  ┌─────────────────────┐                            │
│  │  LM Tools API       │  ← vscode.lm.registerTool  │
│  │  imagewebify_convert│                            │
│  └────────┬────────────┘                            │
│           │                                         │
└───────────┼─────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│  vsc-image-webify-ai-tool                             │
│                                                       │
│  ┌──────────────┐    ┌──────────────────┐             │
│  │ Tool Layer   │    │ Command Layer     │             │
│  │ (LM Tools)   │    │ (VS Code cmds)    │             │
│  └──────┬───────┘    └────────┬─────────┘             │
│         │                    │                        │
│         ▼                    ▼                        │
│  ┌─────────────────────────────────┐                  │
│  │         Core Layer              │                  │
│  │  requestParser  orchestrator    │                  │
│  │  resultFormatter dependencyDet. │                  │
│  └──────────────┬──────────────────┘                  │
│                 │                                     │
│         ┌───────▼────────┐                           │
│         │  Bridge Layer  │                           │
│         │  bridgeSelector│                           │
│         └──┬──┬──┬───────┘                           │
│            │  │  │                                   │
└────────────┼──┼──┼───────────────────────────────────┘
             │  │  │
    ┌────────┘  │  └────────────┐
    ▼           ▼               ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐
│Command  │ │Export    │ │Fallback      │
│Bridge   │ │Bridge    │ │Bridge(sharp) │
│         │ │          │ │              │
│vsc-image│ │extension │ │No dependency │
│-webify  │ │.exports  │ │required      │
│commands │ │          │ │              │
└─────────┘ └──────────┘ └──────────────┘
```

## Layers

### Tool Layer (`src/tools/`)
Implements `vscode.LanguageModelTool<T>` for each registered AI tool. Tools validate input, delegate to the core layer, and return structured JSON results.

### Command Layer (`src/commands/`)
Implements traditional VS Code commands for the Command Palette, providing UI dialogs for human interaction.

### Core Layer (`src/core/`)
- **requestParser**: Validates and normalizes tool/command inputs
- **conversionOrchestrator**: Coordinates conversion flow including file existence checks and batch expansion
- **resultFormatter**: Formats results as structured JSON strings for LM consumption
- **dependencyDetector**: Detects `geckod22.vsc-image-webify` status and selects bridge strategy

### Bridge Layer (`src/bridges/`)
Three bridge implementations with a selector:
1. **command-bridge**: Uses `vscode.commands.executeCommand` to invoke vsc-image-webify commands
2. **export-bridge**: Calls the exported API of vsc-image-webify directly
3. **fallback-bridge**: Uses `sharp` for standalone conversion (no dependency required)

## Configuration

All configuration lives under the `imageWebifyAi` namespace in VS Code settings.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `preferBridge` | string | `auto` | Bridge strategy override |
| `defaultQuality` | number | `85` | Default conversion quality |
| `defaultOutputFormat` | string | `webp` | Default output format |
| `overwriteByDefault` | boolean | `false` | Overwrite existing files |
| `enableBatchTool` | boolean | `true` | Enable batch LM tool |
| `logLevel` | string | `info` | Log verbosity |
