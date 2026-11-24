# Phonics Games 런처

파닉스 게임 9개를 한 화면에서: 게임 카드(타이틀 화면·한 줄 소개·플레이) · 게임별 TRD · 세트 점검표 · 보완 목록(골라서 복사).
빌드 없는 정적 페이지 — `index.html`을 바로 열면 된다(file:// 가능).

| 파일 | 역할 |
|---|---|
| `trd/<id>.md` | 게임별 TRD (front matter + 12절, 양식 `trd/_TEMPLATE.md`) |
| `audit.json` | 점검 기준 × 게임 표, 보완 목록(우선순위) |
| `img/<id>.webp` | 카드용 타이틀 화면 ← `uv run --with playwright==1.62.0 --with pillow python tools/shots.py [id …]` |
| `js/data.js` | 생성물 ← `uv run --with markdown python tools/build.py` (TRD·점검표를 고친 뒤 실행) |
| `js/launcher.js`, `css/launcher.css` | 화면 |
| `css/arcade.css` | 아케이드 나이트 테마(2026-11-24, 시안 3개 중 B): 어두운 무대 · '오늘의 게임'(6초마다 넘김, 썸네일 줄) · 게임별 색 `--gc`. 인쇄는 밝게 |

- 순서: **최근에 만든 게임이 맨 위**(사용자 2026-11-24). 새 게임은 `tools/build.py` `ORDER`와 `audit.json` `games`의 맨 앞에 넣는다 — 카드 번호 01…·오늘의 게임·점검표 열이 이 순서를 따른다.
- TRD는 인쇄·PDF 버튼으로 A4 가로 출력.
- 보완 목록에서 고른 항목은 이 브라우저에만 기억되고, "고른 항목 복사"로 채팅에 붙여 넣는다.
- 2026-11-22 점검: 4개 에이전트가 각 게임 코드·README를 읽고 정리(읽기 전용). 공통 규칙 Skip·Jump 반영.
