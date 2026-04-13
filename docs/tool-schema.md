# Tool Schema Reference

## imagewebify_convert

Converts a single image file to a target format.

### Input Schema

```json
{
  "type": "object",
  "required": ["input", "targetFormat"],
  "properties": {
    "input": {
      "type": "string",
      "description": "Path to the input image (absolute or workspace-relative)"
    },
    "targetFormat": {
      "type": "string",
      "enum": ["webp", "avif", "png", "jpg", "jpeg"]
    },
    "quality": {
      "type": "number",
      "minimum": 1,
      "maximum": 100,
      "description": "Output quality, default 85"
    },
    "output": {
      "type": "string",
      "description": "Optional explicit output path"
    },
    "overwrite": {
      "type": "boolean",
      "description": "Overwrite existing output, default false"
    }
  }
}
```

### Output Schema

**Success:**
```json
{
  "success": true,
  "strategy": "fallback-bridge",
  "input": "images/photo.png",
  "output": "images/photo.webp",
  "targetFormat": "webp",
  "quality": 85,
  "message": "Image converted successfully via fallback bridge (sharp)"
}
```

**Failure:**
```json
{
  "success": false,
  "errorCode": "INPUT_FILE_NOT_FOUND",
  "message": "Input file not found: images/photo.png",
  "recovery": ["Check that the input file path is correct"]
}
```

---

## imagewebify_batch_convert

Converts multiple images or a directory of images.

### Input Schema

```json
{
  "type": "object",
  "required": ["inputs", "targetFormat"],
  "properties": {
    "inputs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Array of file paths or directory paths"
    },
    "targetFormat": {
      "type": "string",
      "enum": ["webp", "avif", "png", "jpg", "jpeg"]
    },
    "quality": { "type": "number", "minimum": 1, "maximum": 100 },
    "outputDir": { "type": "string" },
    "recursive": { "type": "boolean", "description": "Recurse into subdirectories" },
    "overwrite": { "type": "boolean" }
  }
}
```

### Output Schema

```json
{
  "success": true,
  "strategy": "fallback-bridge",
  "total": 5,
  "succeeded": 5,
  "failed": 0,
  "message": "Successfully converted 5 file(s) to webp",
  "results": [
    {
      "success": true,
      "input": "images/a.png",
      "output": "images/a.webp",
      "message": "..."
    }
  ]
}
```

---

## imagewebify_get_capabilities

Returns extension capabilities and dependency status.

### Input Schema

```json
{
  "type": "object",
  "properties": {
    "includeDependencyStatus": { "type": "boolean", "default": true }
  }
}
```

### Output Schema

```json
{
  "extensionId": "malagege.vsc-image-webify-ai-tool",
  "version": "0.1.0",
  "supportedInputFormats": ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"],
  "supportedOutputFormats": ["webp", "avif", "png", "jpg", "jpeg"],
  "availableTools": ["imagewebify_convert", "imagewebify_batch_convert", "imagewebify_get_capabilities"],
  "dependency": {
    "extensionInstalled": true,
    "extensionActive": true,
    "extensionId": "geckod22.vsc-image-webify",
    "availableCommands": ["vsc-image-webify.convertToWebP"],
    "hasExports": false,
    "recommendedStrategy": "command-bridge"
  }
}
```
