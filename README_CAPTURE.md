# Auto-UI Photographer

Automatically captures the extension popup UI and generates Web Store screenshots.

## Installation

Install required dependencies:

```bash
npm install puppeteer sharp
```

## Usage

Run the capture script:

```bash
npm run capture-ui
```

## What it does

1. **Builds the extension** (`npm run build`)
2. **Launches Chrome** with the extension loaded
3. **Finds the extension ID** automatically
4. **Captures a screenshot** of the popup (340x480 @ 2x scale)
5. **Processes the image** onto a 1280x800 Deep Navy canvas
6. **Saves** to `store_assets/screenshot-1280x800.png`

## Output

- `store_assets/screenshot-1280x800.png` - Web Store screenshot (1280x800)

## Notes

- The script automatically finds the extension ID from Chrome's loaded extensions
- Screenshot is centered on a Deep Navy (`#141e2d`) background
- Temp files are automatically cleaned up

