#!/usr/bin/env python3
"""
BECOME PRISM: Chrome Web Store Asset Generator (Master Eye)
Generates all required assets from master_eye.png + 5 Philosophical Posters
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow is not installed.")
    print("Please install it by running: pip install Pillow")
    sys.exit(1)

# Configuration
SOURCE_IMAGE = "public/master_eye.png"
OUTPUT_DIR = "store_assets"
BACKGROUND_COLOR = (20, 30, 45)  # Deep Navy #141e2d
GOLD_COLOR = (255, 215, 0)  # Gold Neon
CYAN_COLOR = (0, 255, 255)  # Cyan Neon
WHITE_COLOR = (255, 255, 255)
DIM_GRAY = (180, 180, 180)

def ensure_dir(path):
    """Create directory if it doesn't exist."""
    Path(path).mkdir(parents=True, exist_ok=True)
    print(f"✓ Directory ensured: {path}")

def load_source():
    """Load the source master eye image."""
    if not os.path.exists(SOURCE_IMAGE):
        print(f"ERROR: Source image not found at {SOURCE_IMAGE}")
        sys.exit(1)
    
    image = Image.open(SOURCE_IMAGE)
    print(f"✓ Loaded source: {SOURCE_IMAGE} ({image.size[0]}x{image.size[1]})")
    return image

def get_font(size, bold=True):
    """Try to load a system font, fallback to default."""
    try:
        # Try Windows fonts
        if sys.platform == "win32":
            font_paths = [
                "C:/Windows/Fonts/arialbd.ttf",  # Arial Bold
                "C:/Windows/Fonts/arial.ttf",   # Arial
                "C:/Windows/Fonts/calibrib.ttf", # Calibri Bold
            ]
            for path in font_paths:
                if os.path.exists(path):
                    return ImageFont.truetype(path, size)
        # Try macOS fonts
        elif sys.platform == "darwin":
            font_paths = [
                "/Library/Fonts/Arial Bold.ttf",
                "/System/Library/Fonts/Helvetica.ttc",
            ]
            for path in font_paths:
                if os.path.exists(path):
                    return ImageFont.truetype(path, size)
    except:
        pass
    
    # Fallback to default font
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        return ImageFont.load_default()

def generate_icon_128(source):
    """Generate 128x128 store icon."""
    print("\n[1/4] Generating Store Icon (128x128)...")
    
    icon = source.resize((128, 128), Image.Resampling.LANCZOS)
    output_path = os.path.join(OUTPUT_DIR, "icon-128.png")
    icon.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_promo_440(source):
    """Generate 440x280 small promo tile with centered 220x220 logo."""
    print("\n[2/4] Generating Small Promo Tile (440x280)...")
    
    promo = Image.new("RGB", (440, 280), BACKGROUND_COLOR)
    logo_size = 220
    logo_resized = source.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    center_x = (440 - logo_size) // 2
    center_y = (280 - logo_size) // 2
    
    if logo_resized.mode == "RGBA":
        promo.paste(logo_resized, (center_x, center_y), logo_resized)
    else:
        promo.paste(logo_resized, (center_x, center_y))
    
    output_path = os.path.join(OUTPUT_DIR, "promo-440.png")
    promo.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_promo_1400(source):
    """Generate 1400x560 marquee promo tile with centered 480x480 logo."""
    print("\n[3/4] Generating Marquee Promo Tile (1400x560)...")
    
    promo = Image.new("RGB", (1400, 560), BACKGROUND_COLOR)
    logo_size = 480
    logo_resized = source.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    center_x = (1400 - logo_size) // 2
    center_y = (560 - logo_size) // 2
    
    if logo_resized.mode == "RGBA":
        promo.paste(logo_resized, (center_x, center_y), logo_resized)
    else:
        promo.paste(logo_resized, (center_x, center_y))
    
    output_path = os.path.join(OUTPUT_DIR, "promo-1400.png")
    promo.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_screenshot_bg():
    """Generate 1280x800 screenshot background canvas."""
    print("\n[4/4] Generating Screenshot Background (1280x800)...")
    
    screenshot_bg = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    output_path = os.path.join(OUTPUT_DIR, "screenshot-bg.png")
    screenshot_bg.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_poster_01_vision(source):
    """Poster 1: The Vision - BECOME PRISM (Gold Neon) + Eye."""
    print("\n[Poster 1/5] Generating 'The Vision'...")
    
    canvas = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Left side (70%): Text
    left_margin = 80
    title_font = get_font(120, bold=True)
    title_text = "BECOME PRISM"
    
    # Draw title with glow effect (multiple layers for neon)
    title_y = 300
    for offset in [(2, 2), (1, 1), (0, 0)]:
        draw.text(
            (left_margin + offset[0], title_y + offset[1]),
            title_text,
            fill=GOLD_COLOR if offset == (0, 0) else tuple(c // 3 for c in GOLD_COLOR),
            font=title_font
        )
    
    # Right side (30%): Eye visual
    eye_size = 400
    eye_resized = source.resize((eye_size, eye_size), Image.Resampling.LANCZOS)
    eye_x = 1280 - 384 - 80  # Right margin
    eye_y = (800 - eye_size) // 2
    
    if eye_resized.mode == "RGBA":
        canvas.paste(eye_resized, (eye_x, eye_y), eye_resized)
    else:
        canvas.paste(eye_resized, (eye_x, eye_y))
    
    output_path = os.path.join(OUTPUT_DIR, "01_vision.png")
    canvas.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_poster_02_friction(source):
    """Poster 2: Zero Friction - ZERO FRICTION. + Eye."""
    print("\n[Poster 2/5] Generating 'Zero Friction'...")
    
    canvas = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Left side (70%): Text
    left_margin = 80
    title_font = get_font(100, bold=True)
    subtitle_font = get_font(36, bold=False)
    
    title_text = "ZERO FRICTION."
    subtitle_text = "Capture thought at the speed of light."
    
    title_y = 280
    draw.text((left_margin, title_y), title_text, fill=WHITE_COLOR, font=title_font)
    
    subtitle_y = title_y + 140
    draw.text((left_margin, subtitle_y), subtitle_text, fill=DIM_GRAY, font=subtitle_font)
    
    # Right side (30%): Eye visual (as UI placeholder)
    eye_size = 350
    eye_resized = source.resize((eye_size, eye_size), Image.Resampling.LANCZOS)
    eye_x = 1280 - 384 - 80
    eye_y = (800 - eye_size) // 2
    
    if eye_resized.mode == "RGBA":
        canvas.paste(eye_resized, (eye_x, eye_y), eye_resized)
    else:
        canvas.paste(eye_resized, (eye_x, eye_y))
    
    output_path = os.path.join(OUTPUT_DIR, "02_friction.png")
    canvas.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_poster_03_modes(source):
    """Poster 3: The Modes - TEMPLE & TALISMAN. + Eye."""
    print("\n[Poster 3/5] Generating 'The Modes'...")
    
    canvas = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Left side (70%): Text
    left_margin = 80
    title_font = get_font(90, bold=True)
    subtitle_font = get_font(36, bold=False)
    
    title_text = "TEMPLE & TALISMAN."
    subtitle_text = "Switch between Immersion and Speed."
    
    title_y = 280
    draw.text((left_margin, title_y), title_text, fill=WHITE_COLOR, font=title_font)
    
    subtitle_y = title_y + 140
    draw.text((left_margin, subtitle_y), subtitle_text, fill=DIM_GRAY, font=subtitle_font)
    
    # Right side (30%): Eye visual (as UI placeholder)
    eye_size = 350
    eye_resized = source.resize((eye_size, eye_size), Image.Resampling.LANCZOS)
    eye_x = 1280 - 384 - 80
    eye_y = (800 - eye_size) // 2
    
    if eye_resized.mode == "RGBA":
        canvas.paste(eye_resized, (eye_x, eye_y), eye_resized)
    else:
        canvas.paste(eye_resized, (eye_x, eye_y))
    
    output_path = os.path.join(OUTPUT_DIR, "03_modes.png")
    canvas.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_poster_04_architecture(source):
    """Poster 4: The Architecture - WELCOME TO THE ARCHITECTURE. (Cyan) + Eye."""
    print("\n[Poster 4/5] Generating 'The Architecture'...")
    
    canvas = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Left side (70%): Text
    left_margin = 80
    title_font = get_font(75, bold=True)
    subtitle_font = get_font(36, bold=False)
    
    title_text = "WELCOME TO THE ARCHITECTURE."
    subtitle_text = "Auto-routing. AI Injection. Sentient UI."
    
    title_y = 280
    # Draw title with cyan glow
    for offset in [(2, 2), (1, 1), (0, 0)]:
        draw.text(
            (left_margin + offset[0], title_y + offset[1]),
            title_text,
            fill=CYAN_COLOR if offset == (0, 0) else tuple(c // 3 for c in CYAN_COLOR),
            font=title_font
        )
    
    subtitle_y = title_y + 140
    draw.text((left_margin, subtitle_y), subtitle_text, fill=DIM_GRAY, font=subtitle_font)
    
    # Right side (30%): Eye visual (as UI placeholder)
    eye_size = 350
    eye_resized = source.resize((eye_size, eye_size), Image.Resampling.LANCZOS)
    eye_x = 1280 - 384 - 80
    eye_y = (800 - eye_size) // 2
    
    if eye_resized.mode == "RGBA":
        canvas.paste(eye_resized, (eye_x, eye_y), eye_resized)
    else:
        canvas.paste(eye_resized, (eye_x, eye_y))
    
    output_path = os.path.join(OUTPUT_DIR, "04_architecture.png")
    canvas.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def generate_poster_05_visionary(source):
    """Poster 5: The Investment - BECOME A VISIONARY. (Gold) + Eye."""
    print("\n[Poster 5/5] Generating 'The Investment'...")
    
    canvas = Image.new("RGB", (1280, 800), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Left side (70%): Text
    left_margin = 80
    title_font = get_font(85, bold=True)
    subtitle_font = get_font(36, bold=False)
    
    title_text = "BECOME A VISIONARY."
    subtitle_text = "This is not a donation. It is an investment."
    
    title_y = 280
    # Draw title with gold glow
    for offset in [(2, 2), (1, 1), (0, 0)]:
        draw.text(
            (left_margin + offset[0], title_y + offset[1]),
            title_text,
            fill=GOLD_COLOR if offset == (0, 0) else tuple(c // 3 for c in GOLD_COLOR),
            font=title_font
        )
    
    subtitle_y = title_y + 140
    draw.text((left_margin, subtitle_y), subtitle_text, fill=DIM_GRAY, font=subtitle_font)
    
    # Right side (30%): Eye visual (as UI placeholder)
    eye_size = 350
    eye_resized = source.resize((eye_size, eye_size), Image.Resampling.LANCZOS)
    eye_x = 1280 - 384 - 80
    eye_y = (800 - eye_size) // 2
    
    if eye_resized.mode == "RGBA":
        canvas.paste(eye_resized, (eye_x, eye_y), eye_resized)
    else:
        canvas.paste(eye_resized, (eye_x, eye_y))
    
    output_path = os.path.join(OUTPUT_DIR, "05_visionary.png")
    canvas.save(output_path, "PNG", optimize=True)
    print(f"✓ Saved: {output_path}")

def main():
    """Main execution function."""
    print("=" * 60)
    print("BECOME PRISM: Chrome Web Store Asset Generator")
    print("Source: master_eye.png")
    print("=" * 60)
    
    ensure_dir(OUTPUT_DIR)
    source = load_source()
    
    # Generate standard assets
    print("\n" + "=" * 60)
    print("GENERATING STANDARD ASSETS")
    print("=" * 60)
    generate_icon_128(source)
    generate_promo_440(source)
    generate_promo_1400(source)
    generate_screenshot_bg()
    
    # Generate philosophical posters
    print("\n" + "=" * 60)
    print("GENERATING PHILOSOPHICAL POSTERS")
    print("=" * 60)
    generate_poster_01_vision(source)
    generate_poster_02_friction(source)
    generate_poster_03_modes(source)
    generate_poster_04_architecture(source)
    generate_poster_05_visionary(source)
    
    print("\n" + "=" * 60)
    print("✓ All assets generated successfully!")
    print(f"✓ Output directory: {OUTPUT_DIR}/")
    print("=" * 60)
    print("\nStandard Assets:")
    print("  - icon-128.png")
    print("  - promo-440.png")
    print("  - promo-1400.png")
    print("  - screenshot-bg.png")
    print("\nPhilosophical Posters (1280x800):")
    print("  - 01_vision.png")
    print("  - 02_friction.png")
    print("  - 03_modes.png")
    print("  - 04_architecture.png")
    print("  - 05_visionary.png")
    print("\nAll files are ready in store_assets/ folder!")

if __name__ == "__main__":
    main()
