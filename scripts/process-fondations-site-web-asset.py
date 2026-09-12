#!/usr/bin/env python3
"""Prepare the exported ASCII Magic asset for BUILD Fondations."""

from pathlib import Path
from shutil import copyfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
COLLECTION = ROOT / "private/brand-assets/build-collection-cards/pages/fondations/09-construire-un-site-web-avec-l-ia"
SOURCE = COLLECTION / "ascii-raw/09-construire-un-site-web-avec-l-ia-atkinson.png"
OUTPUT = COLLECTION / "final/09-construire-un-site-web-avec-l-ia-build.png"
PUBLIC_COPY = ROOT / "public/assets/illustrations/fondations-site-web.png"
TARGET_SIZE = (1254, 1254)

BACKGROUND = (14, 14, 15)
SHADOW = (103, 91, 68)
MID = (201, 180, 138)
HIGHLIGHT = (240, 237, 232)


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        round(a[0] + (b[0] - a[0]) * t),
        round(a[1] + (b[1] - a[1]) * t),
        round(a[2] + (b[2] - a[2]) * t),
    )


def colour(value: int) -> tuple[int, int, int]:
    normalized = value / 255
    if normalized < 0.16:
        return BACKGROUND
    if normalized < 0.48:
        return mix(BACKGROUND, SHADOW, (normalized - 0.16) / 0.32)
    if normalized < 0.82:
        return mix(SHADOW, MID, (normalized - 0.48) / 0.34)
    return mix(MID, HIGHLIGHT, (normalized - 0.82) / 0.18)


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Export ASCII Magic introuvable: {SOURCE}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    image = Image.open(SOURCE).convert("L")
    image = image.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    rgb = Image.new("RGB", image.size)
    pixels = list(image.tobytes())
    rgb.putdata([colour(value) for value in pixels])
    rgb.save(OUTPUT, optimize=True)
    copyfile(OUTPUT, PUBLIC_COPY)
    print(f"created {OUTPUT} ({rgb.width}x{rgb.height}, {rgb.mode})")
    print(f"published verbatim {PUBLIC_COPY}")


if __name__ == "__main__":
    main()
