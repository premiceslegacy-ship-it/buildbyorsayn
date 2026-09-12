#!/usr/bin/env python3
"""Anonymise les captures tutoriels sans modifier leur interface utile."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public/assets/tutorials"
INK = (31, 35, 40)
FIELD = (246, 248, 250)
BORDER = (208, 215, 222)
GOLD = (232, 213, 176)


def font(size: int):
    for path in (
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            pass
    return ImageFont.load_default()


def replace_owner(path: Path, box: tuple[int, int, int, int], text: str = "compte-demo") -> None:
    image = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(box, radius=7, fill=FIELD, outline=BORDER, width=1)
    draw.ellipse((box[0] + 10, box[1] + 10, box[0] + 30, box[1] + 30), fill=(220, 225, 230))
    draw.text((box[0] + 39, box[1] + 11), text, font=font(15), fill=INK)
    image.save(path, quality=92, optimize=True)


def replace_visibility(path: Path, box: tuple[int, int, int, int]) -> None:
    image = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(box, radius=7, fill=FIELD, outline=BORDER, width=1)
    x, y = box[0] + 13, box[1] + 10
    draw.rectangle((x, y + 7, x + 12, y + 17), outline=(87, 96, 106), width=2)
    draw.arc((x + 2, y, x + 10, y + 12), 180, 360, fill=(87, 96, 106), width=2)
    draw.text((x + 22, y + 1), "Private", font=font(15), fill=INK)
    image.save(path, quality=92, optimize=True)


def draw_annotation(path: Path, box: tuple[int, int, int, int], number: str) -> None:
    image = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle(box, radius=9, outline=GOLD, width=5)
    cx, cy, radius = box[0] - 8, box[1] - 8, 17
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=GOLD, outline=INK, width=2)
    label = font(18)
    text_box = draw.textbbox((0, 0), number, font=label)
    draw.text((cx - (text_box[2] - text_box[0]) / 2, cy - 11), number, font=label, fill=INK)
    image.save(path, quality=92, optimize=True)


def anonymise_clone(path: Path) -> None:
    image = Image.open(path).convert("RGB")
    blurred = image.filter(ImageFilter.GaussianBlur(radius=12))
    menu = image.crop((124, 94, 523, 418))
    blurred.paste(menu, (124, 94))
    draw = ImageDraw.Draw(blurred)
    draw.rounded_rectangle((138, 226, 471, 260), radius=6, fill=FIELD, outline=BORDER, width=1)
    draw.text((151, 234), "https://github.com/compte-demo/site-client.git", font=font(12), fill=INK)
    blurred.save(path, quality=92, optimize=True)


def main() -> None:
    step_1 = ASSETS / "github-creer-depot-etape-1.jpg"
    replace_owner(step_1, (39, 132, 266, 185))
    replace_visibility(step_1, (602, 390, 735, 454))
    draw_annotation(step_1, (596, 385, 741, 459), "2")

    step_2 = ASSETS / "github-creer-depot-etape-2.jpg"
    replace_owner(step_2, (45, 31, 272, 67))
    replace_visibility(step_2, (613, 271, 728, 323))

    anonymise_clone(ASSETS / "github-copier-url-clone.jpg")
    print("captures tutoriels anonymisées et visibilité Private affichée")


if __name__ == "__main__":
    main()
