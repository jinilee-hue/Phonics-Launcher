"""Title screens of every phonics game from GitHub Pages -> img/<id>.webp (960 x 540) for the launcher cards.
uv run --with playwright==1.62.0 --with pillow python tools/shots.py [id ...]"""
import sys, time, pathlib, io
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAMES = {
    'eye-catch': 'https://jinilee-hue.github.io/Eye-Catch/',
    'magic-block': 'https://jinilee-hue.github.io/Magic-Block/',
    'phonics-match': 'https://jinilee-hue.github.io/Phonics-Match/',
    'croco': 'https://jinilee-hue.github.io/Croco-Phonics/',
    'word-mashup': 'https://jinilee-hue.github.io/phonics-wordmashup-3D/',
    'toy-catch': 'https://jinilee-hue.github.io/Toy-Catch/',
    'ring-ding-dong': 'https://jinilee-hue.github.io/Phonics-Halli-Galli-3D/',
    'puzzle': 'https://jinilee-hue.github.io/Phonics-Puzzle/',
}
WAIT = {'word-mashup': 9, 'magic-block': 8, 'toy-catch': 8, 'ring-ding-dong': 8, 'eye-catch': 7, 'croco': 7}
pick = sys.argv[1:] or list(GAMES)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'])
    for gid in pick:
        pg = b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
        try:
            pg.goto(GAMES[gid], wait_until='load', timeout=60000)
        except Exception as e:
            print(gid, 'load issue', e)
        time.sleep(WAIT.get(gid, 5))
        im = Image.open(io.BytesIO(pg.screenshot())).convert('RGB').resize((960, 540), Image.LANCZOS)
        im.save(ROOT / f'img/{gid}.webp', quality=82, method=6)
        print(gid, 'ok')
        pg.close()
    b.close()
