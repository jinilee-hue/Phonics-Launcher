---
id: ring-ding-dong
title: Ring Ding Dong
title_ko: 링딩동
tagline: 카드에 그림이 여러 개면 Coco보다 먼저 종을 치는 게임
players: 1인
skill: 단수·복수 -s 구별 (그림 개수 보기 + 단어 끝소리 듣기)
stack: Vanilla JS + three.js r186 (WebGL, 빌드 없음)
repo: https://github.com/jinilee-hue/Phonics-Halli-Galli-3D
url: https://jinilee-hue.github.io/Phonics-Halli-Galli-3D/
updated: 2026-11-22
---

# Ring Ding Dong TRD

## 1. 개요
- 목적: 아이와 Coco(분홍 손종, 컴퓨터 상대)가 번갈아 카드를 뒤집는다. 카드가 "여러 개"(복수형 -s)면 종을 먼저 친 쪽이 S 토큰을 얻고, S 3개를 먼저 모으면 이긴다.
- 대상 연령: 5–7세. 정의된 단계는 5세(K)·6세(A)·7세(B)지만, 지금은 5세만 열려 있다.
- 학습 목표: 규칙 복수형 -s(연구팩 문법 항목 NP-01) 구별. 카드를 뒤집을 때마다 단어 음성을 들려준다. 7세 단계에는 -es 복수와 s로 끝나는 단수 함정이 들어간다.
  - **FP.K.U1L1 "Mm" 레슨과는 관련이 없다.** 단어도 Mm 단어가 아니고, 아이가 말하는 부분도 없다.
- 플레이 인원: 1인(대 Coco).
- 한 판 시간: S 3개를 먼저 모을 때까지 1–3분(추정).
- 구조: 원래 2D 게임(`../Phonics-Halli-Galli`, Vite, 포트 5181)은 그대로 두고, 판·종·Coco를 WebGL 3D로 다시 그린 시제품이다. `src/`는 원본의 사본이다.

## 2. 게임 흐름
1. 인트로 모션그래픽(`gl/intro-mg.js`, 약 10.85초): 로고, START, 종 울림을 나레이션 시각에 맞춰 보여 준다. SKIP은 1.5초 뒤에 나온다. 자동재생이 막히면 소리 없이 시작하고, 한 번 누르면 소리가 난다.
2. 타이틀: 로고, START, 종 둘레를 도는 카드. 단계 버튼은 숨겨져 있다(`gl/levels.css:3-5`). 상단에 언어, 360°, 소리, 나가기 버튼이 있다.
3. START를 누르면 Coco가 "Hi! / I'm Coco!", 튜터(노란 종)가 "Ready? Go!"라고 말한다. 경과 시간 시계가 흐르기 시작한다.
4. 한 턴
   1. 내 차례면 내 카드 더미에 손 안내가 뜬다. 더미를 누르면 카드가 가운데로 날아와 뒤집히고 단어 음성이 나온다(`main.js:173-196`).
   2. Coco 차례면 Coco가 단계별 시간 뒤 자동으로 뒤집는다(1단계 3.2초).
   3. 복수 카드에 먼저 종을 친 쪽: 카드가 S 칸으로 날아가고 S 토큰 +1, 단어를 한 번 더 읽어 준다(`main.js:213-222`).
   4. 단수 카드에 종을 친 쪽: 버저 소리, S 토큰 -1(가진 게 있을 때), 단어를 다시 읽어 준다(`main.js:223-231`).
   5. 차례를 바꾼다. 덱이 비면 다시 섞는다(`main.js:178`).
5. 누군가 S 3개를 모으면 종료한다. 내가 이기면 2.2초, Coco가 이기면 6초 뒤에 결과 화면이 뜬다(`main.js:253-266`).
6. 결과에서 Play Again을 누르면 3단계로, 상단 나가기를 누르면 타이틀로 간다.

## 3. 콘텐츠·데이터
- 출처: 연구팩 '필수 문법 27 × 6과정 출현 낱말 분석 v0.26' 엑셀(시트 `1-1 › 16 단어별 과정별`, NP-01). 7세 함정은 `3-2 › 09_문장별 학습 단계`에서 가져온다. 단어마다 교재 쪽수(`src`)가 붙어 있다.
- 데이터 파일: `src/words.js`(`window.WORDS`). 원본 저장소의 `tools/build_words.py --write`가 만들고, `tools/sync_from_original.py`로 3D 폴더에 복사한다. 3D 폴더에서는 고치지 않는다.

| 단계 | 낱말 | 덱 구성(`main.js:13-28`) |
|---|---|---|
| 1단계·5세·K | 17쌍: cat cracker hat bat bug dog dot egg hill jet jug leg lip pan pet pig pot | 17장 중 40% 복수 |
| 2단계·6세·A | 62쌍(뺀 낱말 11개) | 10쌍을 단수·복수 짝으로. 3D에서는 그림이 있는 낱말만(`gl/lv-cards.js`) |
| 3단계·7세·B | -es 8, 함정 8, 일반 -s 59(서로 다른 낱말 74개) | -es 5쌍 + 함정 4 + 일반 6 |

- 카드 그림: 원본 `assets/card/card_<낱말>.png`(개수 숫자, 테두리, 단어가 그려져 있음). 가운데 그림은 파닉스 공통 대표 이미지로 바꾼다(`tools/rep_cards.py`, 48개 중 42개).
- 다른 레슨 추가: 규칙이 단/복수 구별이라 음가 레슨(예: Mm)은 그대로 넣을 수 없다. 넣으려면 단어마다 개수 숫자가 들어간 단수·복수 그림 2장과 원본 저장소의 단어 목록 수정, 동기화가 필요하다.

## 4. 레벨·난이도
| 단계 | Coco 반응(카드가 열린 뒤) | 놓침(복수) | 잘못 침(단수) | Coco 뒤집기 대기 |
|---|---|---|---|---|
| 1 | 2.42–3.02초 | 25% | 8% | 3.2초 |
| 2 | 1.77–2.17초 | 12% | 6% | 2.2초 |
| 3 | 1.37–1.67초 | 5% | 4% | 1.9초 |

- 반응 시간은 `400ms + react 범위 + 220ms`로 계산한다(`main.js:33-43, 198-204`).
- 레벨 선택: 2026-11-20부터 타이틀 단계 버튼을 숨겼다. 5세·K만 열려 있고, 다른 단계는 `?age=6`, `?age=7`로만 들어갈 수 있다.
- 타이머: 경과 시간 표시만 있다(카운트다운 아님). 내 차례에는 제한 시간이 없다.
- 적응형: Coco 속도는 고정이다. 튜터가 말을 얼마나 거드는지만 적응한다. 첫 판 처음 최대 6장은 자세히 → 그다음은 반응만 → 3연속 정답이면 말없이 → 2연속 오답이면 다음 2장을 다시 자세히(`gl/tutor.js:22-31`).

## 5. 보상·피드백
- S 토큰: 판에 S 칸 3개씩 있다. 맞히면 카드 그림이 S 칸으로 날아가고, 틀리면 1개를 잃는다. 다른 데 쓰거나 모아 두는 기능은 없다.
- 판 위 연출(3D): 색 테두리, 바닥 빛, 반짝이, S 동전. 종 표정(활짝/앗), Coco 표정 8가지와 말풍선.
- 결과 화면(`src/result.js` + `gl/result-fx.js`)
  - 왼쪽: You win! / Good try!, S 토큰 나 vs Coco, Rings·Speed·Oops(맞힌 수, 평균 반응 시간, 실수).
  - 오른쪽: Class Ranking 상위 3명 + 내 줄.
  - 반 친구 기록은 하드코딩된 예시 데이터다(`src/result.js:2,9-33`).
- 축하 연출: 이기면 제목이 튀어 오르고 꽃가루, 지면 제목이 기울었다 일어서고 하트. 토큰이 날아오고 왕관이 붙는다. 숫자가 올라가고 Play Again이 숨쉬듯 움직인다. '동작 줄이기'를 켜면 움직임이 없다.
- 저장: 기록과 진도는 저장하지 않는다(10장 참고).

## 6. 튜터·음성·발음 판정
- 튜터: 노란 종(`gl/tutor.js`). 원래 게임 함수(flip, hitBell, end, reset 등)를 감싸서 끼어든다. 말풍선 없이 음성과 몸짓으로만 안내한다. `?tutor=off`로 끌 수 있다.
  - 대사 18줄: Ready? Go! / Your turn! / Ring the bell! / Just one. Don't ring! / Oops! Just one. / Listen for the s sound! 등. 한국어판도 있다.
  - 낱말 음성을 가리지 않는다(정책 C-05). 낱말을 읽는 동안에는 말하지 않고, 튜터가 말하는 동안 Coco가 기다린다.
- 튜터 음성: 회사 phonics-api TTS `en-US-AvaMultilingualNeural`(파닉스 공통 튜터 목소리, 높이·빠르기는 옛 aiden에 맞춤, `gl/tutor-voice.js`).
- 단어 음성: `src/voice-data.js`, 238개. phonics-api TTS Ava이고 레슨팩 낱말은 팩 녹음이다(`tools/build_word_voice.py`).
- Coco 말풍선: 원본의 한국어 대사를 영어로 바꿔 보여 준다(`gl/coco-en.js`). 한국어를 고르면 원본 그대로다.
- 인트로 나레이션: README 기준 edge-tts `en-US-AvaNeural`(20% 빠르게)이다. phonics-api 버전을 만드는 스크립트(`tools/intro_voice/voice_api.py`)도 있어서, 현재 `gl/media/intro.m4a`가 어느 쪽인지는 확인하지 않았다.
- 발음 판정: 없음. 마이크와 음성인식을 쓰지 않는다.

## 7. 화면·UI 요구사항
- 기준 해상도: 화면 높이(vh) 기준 반응형이다. 3D 카메라를 `.scene`의 CSS 원근과 똑같이 맞춰 HTML 판 위에 겹친다. 성능은 이 맥(M5 Pro)에서 iPad 크기(2360×1640) high 화질로 측정했다(한 장면 0.43ms). 1280×800에서 궤도 카드가 START와 겹치는 것은 허용했다.
- 상단 바
  - 게임 화면: 왼쪽에 로고, 레벨 표시('1단계 · 5세 · K'), 경과 시간 시계(핑크 테마). 오른쪽에 360°, 소리(세로 볼륨 슬라이더), 나가기.
  - 타이틀: 오른쪽 버튼에 언어 토글이 더해진다.
  - 크기는 Toy Catch 기준 7.6tu다(`gl/hud-size.css`).
- 언어 토글(`gl/lang.js`): 타이틀에만 있고 기본값은 영어다. 튜터 음성과 Coco 말풍선만 바뀐다. 결과 화면은 항상 영어이고(`gl/result-fx.js:31-37`) 레벨 표시와 aria-label은 한국어다.
- 터치: 내 더미(+10px 여유), 종(+8px 여유), 다시 듣기 버튼. 키보드는 `Space` = 종, `Enter` = 뒤집기.
- 360° 보기(`gl/view360.js`): 판의 빈 곳을 끌면 판이 돌고, 두 손가락이나 휠로 확대한다. 두 번 탭하면 정면으로 돌아온다.
- 예외 상태
  - WebGL 없음, 그래픽 오류, 너무 느림(low 화질에서 초당 18장 미만): 원래 HTML 판으로 자동 전환하고 7일 동안 기억한다.
  - file://: 그림을 data URL로 넣어 뒀다. 2단계 이상이면 `gl/card-tex.js`(약 5.5MB)를 불러온다.
  - 오프라인: 모든 에셋이 로컬이라 동작한다(추정).
  - 마이크: 사용하지 않음.

## 8. 기술 구성
- 스택: Vanilla HTML/CSS/JS(classic script, file://에서도 동작), three.js r186(`vendor/three/three.iife.js`). 외부 라이브러리는 그 밖에 없다.

| 파일 | 역할 |
|---|---|
| `src/main.js` | 원본 게임 로직: 덱, 턴, 종 판정, Coco AI, 볼륨, 시계 |
| `src/words.js` · `src/cards.js` · `src/voice-data.js` · `src/bgm-data.js` | 원본 사본(단어, 카드 그림, 단어 음성, 배경음악) |
| `src/result.js` · `src/intro.js` · `src/orbit.js` · `src/clock.js` · `src/bgm.js` | 원본 사본(결과, 영상 인트로, 타이틀 궤도 카드, 시계, BGM) |
| `gl/board3d.js` | 3D 판, 카메라, 화질 단계, HTML 판 전환 |
| `gl/bell3d.js` · `gl/coco3d.js` | 3D 종, 3D Coco |
| `gl/view360.js` | 360° 돌려 보기 |
| `gl/intro-mg.js` | 인트로 모션그래픽 |
| `gl/tutor.js` · `gl/tutor-voice.js` | 노란 종 튜터와 대사 음성 |
| `gl/lang.js` · `gl/coco-en.js` | 언어 토글, Coco 영어 말풍선 |
| `gl/lv-cards.js` · `gl/card-art.js` · `gl/card-tex.js` | 6·7세 그림 카드 |
| `gl/result-fx.js` · `gl/clock-color.js` · `gl/levels.css` · `gl/hud-size.css` | 결과 연출, 시계 색, 단계 버튼 숨김, 상단 크기 |

- 실행: `실행.command` → `python3 -m http.server 5182`, 또는 `index.html` 더블클릭.
- 원본 반영: `동기화.command`(`python3 tools/sync_from_original.py`)로 원본의 `src/`, 쓰는 에셋, `index.html`(3D 줄 삽입)을 가져온다.
- 배포: GitHub Pages(main 브랜치, `.nojekyll`). 푸시 뒤 1–2분 걸리고, 브라우저 캐시는 10분이다.

## 9. 에셋·생성 파이프라인
| 대상 | 스크립트·명령 | 출력 |
|---|---|---|
| 원본에서 가져오기 | `python3 tools/sync_from_original.py` | `src/`, `assets/`, `index.html` |
| 6·7세 카드 사본 | `python3 tools/build_card_art.py`(동기화 때 자동) | `gl/media/cards/*.webp`, `gl/card-art.js`, `gl/card-tex.js` |
| 대표 이미지 카드 | `uv run --with numpy --with scipy --with pillow python tools/rep_cards.py` → `build_card_art.py` | 카드 가운데 그림 교체(`tools/rep_cards.json`) |
| 카드 실시간 반영 | `/usr/bin/python3 -u tools/watch_cards.py` | 동기화 후 commit·push(3시간 동안 변화 없으면 종료) |
| 3D 텍스처 | `python3 tools/build_gl_tex.py` | `src/gl-tex.js` |
| Coco 얼굴 | `python3 tools/build_coco_face.py` → `build_gl_tex.py` | `assets/coco_parts/face_base.webp` |
| 시계 색 | `python3 tools/build_clock_color.py` | `gl/media/clock/<테마>/` |
| 튜터 대사 | `uv run --quiet --with numpy python tools/build_tutor_voice.py` | `gl/tutor-voice.js` |
| 단어 음성 | `uv run --quiet --with numpy python tools/build_word_voice.py` | `src/voice-data.js` |
| 인트로 소리 | `tools/intro_voice/voice_gen.py` 또는 `voice_api.py` → `mix_voice.py` | `gl/media/intro.m4a` |
| 단어 목록·배경음악 | 원본 저장소 `tools/build_words.py`, `tools/bgm/` | `src/words.js`, `src/bgm-data.js` |

- phonics-api 키는 로컬 설정 파일에서 읽고 출력하지 않는다.

## 10. 저장 데이터
| 키 | 내용 |
|---|---|
| `hg-volume` | 볼륨 0–1. 0이면 음소거(`src/main.js:121,304`) |
| `hg-lang` | 튜터·Coco 언어 `'en'` 또는 `'ko'`(`gl/lang.js`) |
| `hg3d-quality` | 화질 단계·HTML 판 전환 결정 `{v, gpu, at}`, 7일 유지(`gl/board3d.js:20,1038`) |

- 점수, 진도, 반 기록은 저장하지 않는다. 반 순위는 예시 데이터다.

## 11. QA
- 저장소 안에는 자동 QA 스크립트가 없다. 지금까지의 검사는 임시 경로 `/tmp/gl/hg/`의 스크립트로 했다(스킬 기록, 남아 있는지는 미확인).

| 검사 | 방법 | 통과 기준(기록) |
|---|---|---|
| 단어 출처 | `words_source_check.py` | 모든 카드 낱말이 words.js에 있고 교재 쪽수가 붙어 있음(5세 17/17 K) |
| S 칸 크기 | `slot_fit_check.py`(16개 화면 크기) | S 칸 열이 옆 트레이보다 높지 않음 |
| 단계 버튼 배치 | `levels_check.py`(6개 크기) | 로고·START·상단 바와 겹치지 않음 |
| Coco 속도 | `coco_speed2.py`(실플레이 헤드리스) | 1단계 반응 2.44–3.02초 |
| 성능 | `?fps`, `?q=high\|mid\|low\|html` | 교실 기기 실측은 아직 안 함 |

- 수동 확인용 장치: `?tutor=off`, `?intro=video`, `?age=6|7`, `?clock=purple|off`, `IntroMG.freeze(초)` / `IntroMG.live()`, `window.Tutor.trace` / `Tutor.state`.

## 12. 알려진 이슈·보완 필요
- [높음] 목표 레슨과 맞지 않는다. Mm(FP.K.U1L1) 단어·음가와 무관한 문법(복수 -s) 게임이라, 8개 세트 안에서 어느 레슨에 둘지 결정이 필요하다.
- [높음] 결과 화면의 반 순위가 하드코딩된 가짜 예시(Emma, Leo…)인데 '예시' 표시가 지워져 아이·교사에게 진짜 기록처럼 보인다(`src/result.js:2,9-33`, `gl/result-fx.css:100`).
- [높음] 1단계 카드에 개수 숫자, 그림, 단어가 다 보여서 소리를 듣지 않고 그림만 세도 풀린다. 끝소리 듣기 훈련이 약하다.
- [중간] 말하기·발음 판정이 없다. 다른 파닉스 게임과 달리 phonics-api analyze를 쓰지 않는다.
- [중간] 단계 선택이 숨겨져 있어 사실상 난이도가 하나다. Coco 속도는 적응하지 않고 진도도 저장되지 않는다.
- [중간] 내 차례에 아이가 아무것도 안 하면 "Your turn!" 2번 뒤 계속 기다린다. 시계는 계속 흐른다(`gl/tutor.js:441-457`).
- [중간] 판의 빈 곳을 끌면 판이 돌아서(`gl/view360.js:132-150`) 아이가 플레이 중에 실수로 시점을 돌릴 수 있다.
- [중간] 원본과 3D 두 벌을 유지해야 한다. 단어·그림 수정은 원본에서 하고 동기화해야 하며, 동기화가 `index.html`을 다시 만든다.
- [낮음] 언어 토글이 일관되지 않다. 한국어를 골라도 결과 화면은 영어이고, 영어를 골라도 레벨 표시와 aria-label은 한국어다.
- [낮음] S 토큰을 쓰거나 모아 둘 곳이 없다.
- [낮음] README가 낡았다. 튜터 목소리를 'Ana 아이 목소리'라고 적었지만(README:103, `build_tutor_voice.py` 설명문도 같음) 실제는 Ava Multilingual이다. 단계 버튼을 "다시 보이게 했다"고 적었지만(README:153) 지금은 숨겨져 있다.
- [낮음] 저장소에 QA 스크립트가 없다(임시 경로에만 있었음).
- [낮음] 남은 일(README:206-207): 교실 태블릿·전자칠판 실기기 속도 확인(`?fps`). Coco 다리가 치마에 가려 잘 안 보인다.
- [낮음] 에셋 무게: `src/voice-data.js` 1.6MB, `src/gl-tex.js` 1.2MB, file://에서 2단계 이상이면 `gl/card-tex.js` 5.5MB. 저사양 기기에서 첫 로드가 느릴 수 있다(추정).
- 코드에 TODO/FIXME는 없다.
