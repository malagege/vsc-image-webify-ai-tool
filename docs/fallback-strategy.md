# Fallback Strategy

## Overview

The extension uses a three-tier bridge strategy to ensure image conversion always works, even when the `geckod22.vsc-image-webify` dependency is unavailable or incompatible.

## Bridge Priority

```
auto mode:
  1. command-bridge  (if vsc-image-webify commands are registered)
  2. export-bridge   (if vsc-image-webify exports a convert API)
  3. fallback-bridge (always available via sharp)
```

## Bridge Descriptions

### 1. Command Bridge (`command-bridge`)

**When used:** `geckod22.vsc-image-webify` is installed, active, and registers known commands.

**How it works:**
- Calls `vscode.commands.executeCommand('vsc-image-webify.convertToWebP', uri, options)`
- Falls back to `vsc-image-webify.convert` with format parameter
- Leverages the full feature set of vsc-image-webify

**Pros:** Best integration; uses vsc-image-webify's own conversion logic  
**Cons:** Depends on vsc-image-webify being present and its command API being stable

### 2. Export Bridge (`export-bridge`)

**When used:** `geckod22.vsc-image-webify` is active and exports a `convert`/`convertImage`/`webify` function.

**How it works:**
- Accesses `extension.exports` directly
- Calls the exported function with input/output/format/quality parameters

**Pros:** Programmatic API; no command dispatch overhead  
**Cons:** Depends on vsc-image-webify exporting a stable API

### 3. Fallback Bridge (`fallback-bridge`)

**When used:** Always available; used when neither command nor export bridge is viable.

**How it works:**
- Uses the bundled `sharp` Node.js library
- Performs conversion entirely within the extension process
- No dependency on `geckod22.vsc-image-webify`

**Supported conversions:**
- `→ webp`: `sharp().webp({ quality })`
- `→ avif`: `sharp().avif({ quality })`
- `→ png`: `sharp().png()`
- `→ jpg/jpeg`: `sharp().jpeg({ quality })`

**Pros:** Zero external dependency; cross-platform; reliable  
**Cons:** May differ slightly from vsc-image-webify's conversion quality/settings

## Configuration Override

Users can force a specific bridge via the `imageWebifyAi.preferBridge` setting:

```json
{
  "imageWebifyAi.preferBridge": "fallback"
}
```

Valid values: `auto` (default), `command`, `export`, `fallback`
