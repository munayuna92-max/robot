from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MENU_SOURCE = Path(
    "/Users/muna/Desktop/스크린샷 2026-06-06 오후 12.23.46.png"
)
WAIT_SOURCE = Path(
    "/Users/muna/Downloads/KakaoTalk_Photo_2026-06-06-11-29-29.png"
)


def save_crop(source, box, name, size=(640, 420)):
    image = source.crop(box).convert("RGB")
    image = image.resize(size, Image.Resampling.LANCZOS)
    image.save(ASSETS / name, quality=90, optimize=True)


menu_sheet = Image.open(MENU_SOURCE)

menu_boxes = {
    "ramen-basic.jpg": (10, 108, 146, 220),
    "ramen-egg.jpg": (149, 108, 282, 220),
    "ramen-ricecake.jpg": (284, 108, 420, 220),
    "ramen-ricecake-egg.jpg": (422, 108, 558, 220),
    "kimchi-stew.jpg": (10, 370, 146, 477),
    "chadol-doenjang.jpg": (149, 370, 282, 477),
    "seolleongtang.jpg": (284, 370, 420, 477),
    "seafood-sundubu.jpg": (422, 370, 558, 477),
    "olgaengi-soup.jpg": (10, 541, 146, 646),
    "freshwater-spicy-stew.jpg": (149, 541, 282, 646),
    "mushroom-garlic-hotpot.jpg": (284, 541, 420, 646),
    "sanchae-doenjang.jpg": (422, 541, 558, 646),
}

for filename, box in menu_boxes.items():
    save_crop(menu_sheet, box, filename)

wait_board = Image.open(WAIT_SOURCE)
coffee = wait_board.crop((50, 820, 170, 900)).convert("RGB")
coffee = coffee.resize((360, 300), Image.Resampling.LANCZOS)

cafe = Image.new("RGB", (720, 420), "#f4efe7")
cafe.paste(coffee, (20, 60))
draw = ImageDraw.Draw(cafe)
draw.rounded_rectangle(
    (390, 55, 685, 365),
    radius=28,
    fill="#fffaf2",
    outline="#d9c7a8",
    width=4,
)
draw.polygon([(480, 240), (595, 240), (538, 360)], fill="#c88945")
draw.ellipse((458, 96, 618, 245), fill="#fffdf8", outline="#ded5c7", width=3)
draw.ellipse((486, 72, 590, 168), fill="#fffdf8", outline="#ded5c7", width=3)
draw.ellipse((510, 55, 570, 118), fill="#fffdf8", outline="#ded5c7", width=3)
draw.ellipse((515, 255, 526, 266), fill="#91612e")
draw.ellipse((548, 285, 559, 296), fill="#91612e")
draw.ellipse((530, 320, 541, 331), fill="#91612e")
cafe.save(ASSETS / "coffee-icecream.jpg", quality=92, optimize=True)
