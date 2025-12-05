#!/usr/bin/env python3
"""
BECOME PRISM: Chrome Web Store Asset Generator
Generates all required assets from eye_logo.png
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("ERROR: Pillow is not installed.")
    print("Please install it by running: pip install Pillow")
    sys.exit(1)

# Configuration
SOURCE_LOGO = "public/eye_logo.png"
OUTPUT_DIR = "store_assets"
BACKGROUND_COLOR = (20, 30, 45)  # Deep Navy #141e2d

def ensure_dir(path):
    """Create directory if it doesn't exist."""
    Path(path).mkdir(parents=True, exist_ok=True)
    print(f"✓ Directory ensured: {path}")

def load_logo():
    """Load the source logo image."""
    if not os.path.exists(SOURCE_LOGO):
        print(f"ERROR: Source logo not found at {SOURCE_LOGO}")
        sys.exit(1)
    
    logo = Image.open(SOURCE_LOGO)
    print(f"✓ Loaded logo: {SOURCE_LOGO} ({logo.size[0]}x{logo.size[1]})")
    return logo

def generate_icon_128(logo):
    """Generate 128x128 store icon."""
    print("\n[1/4] Generating Store Icon (128x128)...")
    
    # Resize logo to 128x128 with high-quality resampling
    icon = logo.resize((128, 128), Image.Resampling.LANCZOS)
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "icon-128.png")
    icon.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_promo_440(logo):
    """Generate 440x280 small promo tile with centered logo."""
    print("\n[2/4] Generating Small Promo Tile (440x280)...")
    
    # Create canvas with Deep Navy background
    promo = Image.new("RGB", (440, 280), BACKGROUND_COLOR)
    
    # Resize logo to 200x200 (maintaining aspect ratio)
    logo_size = 200
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Calculate center position
    center_x = (440 - logo_size) // 2
    center_y = (280 - logo_size) // 2
    
    # Paste logo in center (with alpha channel support if present)
    if logo_resized.mode == "RGBA":
        promo.paste(logo_resized, (center_x, center_y), logo_resized)
    else:
        promo.paste(logo_resized, (center_x, center_y))
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "promo-440.png")
    promo.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_promo_1400(logo):
    """Generate 1400x560 marquee promo tile with centered logo."""
    print("\n[3/4] Generating Marquee Promo Tile (1400x560)...")
    
    # Create canvas with Deep Navy background
    promo = Image.new("RGB", (1400, 560), BACKGROUND_COLOR)
    
    # Resize logo to 400x400 (maintaining aspect ratio)
    logo_size = 400
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Calculate center position
    center_x = (1400 - logo_size) // 2
    center_y = (560 - logo_size) // 2
    
    # Paste logo in center (with alpha channel support if present)
    if logo_resized.mode == "RGBA":
        promo.paste(logo_resized, (center_x, center_y), logo_resized)
    else:
        promo.paste(logo_resized, (center_x, center_y))
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "promo-1400.png")
    promo.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_screenshot_bg():
    """Generate 1280x800 screenshot background canvas."""
    print("\n[4/4] Generating Screenshot Background (1280x800)...")
    
    # Create blank canvas with Deep Navy background
    screenshot_bg = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    
    # Save
    output_path = os.path.join(OUTPUT_DIR, "screenshot-bg.png")
    screenshot_bg.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def main():
    """Main execution function."""
    print("=" * 60)
    print("BECOME PRISM: Chrome Web Store Asset Generator")
    print("=" * 60)
    
    # Ensure output directory exists
    ensure_dir(OUTPUT_DIR)
    
    # Load source logo
    logo = load_logo()
    
    # Generate all assets
    generate_icon_128(logo)
    generate_promo_440(logo)
    generate_promo_1400(logo)
    generate_screenshot_bg()
    
    print("\n" + "=" * 60)
    print("✓ All assets generated successfully!")
    print(f"✓ Output directory: {OUTPUT_DIR}/")
    print("=" * 60)
    print("\nGenerated files:")
    print("  - icon-128.png (Store Icon)")
    print("  - promo-440.png (Small Promo Tile)")
    print("  - promo-1400.png (Marquee Promo Tile)")
    print("  - screenshot-bg.png (Screenshot Background Canvas)")
    print("\nAll files are ready for Chrome Web Store upload!")

if __name__ == "__main__":
    main()
