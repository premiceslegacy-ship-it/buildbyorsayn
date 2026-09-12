from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets" / "tutorials"
GOLD = (232, 213, 176, 255)
INK = (18, 18, 20, 255)


def font(size: int):
    for path in (
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    ):
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            pass
    return ImageFont.load_default()


def annotate(source: str, output: str, crop: tuple[int, int, int, int], boxes: list[tuple[int, tuple[int, int, int, int]]]):
    image = Image.open(ASSETS / source).convert("RGBA")
    left, top, right, bottom = crop
    image = image.crop(crop)
    draw = ImageDraw.Draw(image, "RGBA")
    label_font = font(22)

    for number, (x1, y1, x2, y2) in boxes:
        x1 -= left
        x2 -= left
        y1 -= top
        y2 -= top
        pad = 5
        rect = (x1 - pad, y1 - pad, x2 + pad, y2 + pad)
        draw.rounded_rectangle(rect, radius=9, outline=GOLD, width=5)

        badge_r = 17
        badge_x = max(badge_r + 4, rect[0] - 8)
        badge_y = max(badge_r + 4, rect[1] - 8)
        draw.ellipse(
            (badge_x - badge_r, badge_y - badge_r, badge_x + badge_r, badge_y + badge_r),
            fill=GOLD,
            outline=INK,
            width=2,
        )
        text = str(number)
        bbox = draw.textbbox((0, 0), text, font=label_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((badge_x - tw / 2, badge_y - th / 2 - 1), text, font=label_font, fill=INK)

    image.convert("RGB").save(ASSETS / output, quality=92, optimize=True)


annotate(
    "github-new-repository-top-raw.png",
    "github-creer-depot-etape-1.jpg",
    (340, 210, 1130, 805),
    [
        (1, (635, 367, 1086, 397)),
        (2, (959, 620, 1068, 652)),
    ],
)

annotate(
    "github-new-repository-bottom-raw.png",
    "github-creer-depot-etape-2.jpg",
    (335, 90, 1115, 805),
    [
        (3, (385, 527, 1076, 595)),
        (4, (937, 747, 1076, 779)),
    ],
)

annotate(
    "github-clone-url-raw.png",
    "github-copier-url-clone.jpg",
    (500, 255, 1060, 690),
    [
        (1, (913, 311, 1021, 343)),
        (2, (641, 442, 712, 474)),
        (3, (982, 482, 1016, 515)),
    ],
)

annotate(
    "antigravity-start-raw.png",
    "antigravity-ouvrir-ou-cloner.jpg",
    (360, 190, 850, 430),
    [
        (1, (400, 271, 795, 326)),
        (2, (400, 334, 795, 391)),
    ],
)

for raw in ASSETS.glob("*-raw.png"):
    raw.unlink()

print("Generated:")
for output in sorted(ASSETS.glob("*.jpg")):
    print(output.relative_to(ROOT), output.stat().st_size)
