"""Brand mark sprite: the four candy cubes as real rounded 3D dice, pre-rendered with three.js.
uv run --with playwright==1.62.0 --with pillow python tools/mark_sprite.py

Why (user 2026-11-24): the CSS 3D cubes (five <b> faces) showed dark seams where the faces met ("박스 면 사이에 검은색
라인처럼 깨져보이지 않고 이어짐이 부드럽게") and could not have rounded edges ("모서리가 주사위처럼 조금 둥글었으면").
Each cube is the same after a quarter turn, so one quarter turn in N frames covers the whole spin; js/mark.js picks the
frame (and does the hop / squash). Output: img/mark-cubes.webp — 4 rows (orange, teal, pink, gold) x N frames, SIZE px each.
"""
import base64, io, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
N, SIZE = 18, 96                       # frames per quarter turn (5 deg each), px per frame
COLOURS = ['#ff9442', '#3ea9b9', '#f45a9c', '#ffc93a']   # --orange --teal --pink --gold (css/launcher.css)
HTML = """<!doctype html><html><body style="margin:0;background:transparent">
<script type="importmap">{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/" } }</script>
<script type="module">
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const S = %(size)d, N = %(n)d, COLS = %(cols)s;
const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
r.setPixelRatio(1); r.setSize(S, S); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 1.0;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.35;
scene.add(new THREE.HemisphereLight(0xffffff, 0x5e5288, 0.85));
const key = new THREE.DirectionalLight(0xffffff, 2.7); key.position.set(-1.2, 6, 1.6); scene.add(key);   // from above: the top reads lightest
const fill = new THREE.DirectionalLight(0xfff2f8, 0.55); fill.position.set(-3, 1, 3); scene.add(fill);   // the front-left face a step darker, the right face darkest
// the view of the old CSS cubes: from a little above (26 deg) and in front
const cam = new THREE.PerspectiveCamera(20, 1, 0.1, 50), el = 26 * Math.PI / 180, dist = 5.2;
cam.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist); cam.lookAt(0, 0, 0);
const geo = new RoundedBoxGeometry(1, 1, 1, 6, 0.17);                 // dice-like rounded edges
const cube = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
scene.add(cube);
window.frame = (c, k) => {
  cube.material.color.set(COLS[c]);
  cube.rotation.y = (-34 + k * 90 / N) * Math.PI / 180;
  r.setClearColor(0x000000, 0); r.clear(); r.render(scene, cam);
  return r.domElement.toDataURL('image/png');
};
window.ready = true;
</script></body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': SIZE, 'height': SIZE})
    pg.set_content(HTML % {'size': SIZE, 'n': N, 'cols': str(COLOURS)})
    pg.wait_for_function('window.ready', timeout=60000)
    sheet = Image.new('RGBA', (N * SIZE, len(COLOURS) * SIZE), (0, 0, 0, 0))
    for c in range(len(COLOURS)):
        for k in range(N):
            url = pg.evaluate(f'window.frame({c}, {k})')
            im = Image.open(io.BytesIO(base64.b64decode(url.split(',', 1)[1]))).convert('RGBA')
            sheet.paste(im, (k * SIZE, c * SIZE))
    b.close()
out = ROOT / 'img/mark-cubes.webp'
sheet.save(out, 'WEBP', quality=90, method=6)
print(out.relative_to(ROOT), sheet.size, out.stat().st_size // 1024, 'KB')
