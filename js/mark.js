// Brand mark: four candy cubes as real rounded dice (user 2026-11-24: "박스 면 사이에 검은색 라인처럼 깨져보이지 않고
// 이어짐이 부드럽게", "모서리가 주사위처럼 조금 둥글었으면"). The CSS 3D cubes (five faces each) showed dark seams and could
// not round their edges, so the dice are pre-rendered (tools/mark_sprite.py → img/mark-cubes.webp: a quarter turn in
// 18 frames, which is the whole spin since a cube looks the same every 90°). This picks the frame and does the hop.
// Same motion as before: every 4.8 s each cube hops, spins a full turn and lands with a squash, clockwise from the top
// left 0.18 s apart; pointing at the title spins them at once; reduced motion keeps them still.
(() => {
  const cubes = [...document.querySelectorAll('.mark i')];
  const brand = document.querySelector('.brand');
  if (!cubes.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const N = 18, P = 4.8;
  const delay = [0, 0.18, 0.54, 0.36], hoverDelay = [0, 0.07, 0.21, 0.14];   // nth-child 1..4 (TL, TR, BL, BR)
  // [time 0..1, lift px, turn deg, squash x, squash y]
  const IDLE = [[0, 0, 0, 1, 1], [0.62, 0, 0, 1, 1], [0.70, -5, 110, 1, 1], [0.80, -6, 250, 1, 1], [0.88, 0, 360, 1.1, 0.88], [0.94, -1, 360, 0.96, 1.04], [1, 0, 360, 1, 1]];
  const HOP = [[0, 0, 0, 1, 1], [0.4, -6, 200, 1, 1], [0.75, 0, 360, 1.1, 0.88], [1, 0, 360, 1, 1]];
  // cubic-bezier(.4, 0, .2, 1), the old keyframes' easing
  const bez = x => { let t = x; for (let i = 0; i < 6; i++) { const cx = 3 * t * (1 - t) ** 2 * 0.4 + 3 * t * t * (1 - t) * 0.2 + t ** 3 - x, d = 3 * (1 - t) ** 2 * 0.4 + 6 * t * (1 - t) * (0.2 - 0.4) + 3 * t * t * (1 - 0.2); t -= cx / (d || 1); t = Math.min(1, Math.max(0, t)); } return 3 * t * t * (1 - t) + t ** 3; };
  const at = (K, u) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] <= u) i++; const [a, b] = [K[i], K[i + 1]], e = bez((u - a[0]) / (b[0] - a[0] || 1)); return a.map((v, j) => v + (b[j] - v) * e); };
  let hoverAt = -99;
  brand?.addEventListener('mouseenter', () => { hoverAt = performance.now() / 1000; });
  const draw = () => {
    const now = performance.now() / 1000;
    cubes.forEach((c, i) => {
      const h = now - hoverAt - hoverDelay[i];
      const [, y, turn, sx, sy] = h >= 0 && h < 0.8 ? at(HOP, h / 0.8) : at(IDLE, (((now - delay[i]) % P) + P) % P / P);
      c.style.transform = `translateY(${y.toFixed(2)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      c.style.setProperty('--k', Math.floor((((turn % 90) + 90) % 90) / 90 * N) % N);
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
