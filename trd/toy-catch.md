---
id: toy-catch
title: Toy Catch
title_ko: 토이캐치
tagline: 첫소리를 듣고 그 소리로 시작하는 인형을 집게로 뽑아요
players: 1인
skill: 첫소리 m·a·s·t 듣고 그 소리로 시작하는 단어(인형) 고르기 — 말하기 없음
stack: Vanilla JS + three.js r186(IIFE 번들, 빌드 없음)
repo: https://github.com/jinilee-hue/Toy-Catch
url: https://jinilee-hue.github.io/Toy-Catch/
updated: 2026-11-22
---

# Toy Catch TRD

## 1. 개요
- 목적: 3D 인형뽑기 기계로 첫소리 듣고 찾기를 연습한다. 목표 음가(/m/)를 듣고, 그 소리로 시작하는 인형을 집게로 뽑는다.
- 대상: 5~7세 한국 유치원생. 콘텐츠·화면 글자는 영어, 안내 음성만 EN/한 선택.
- 학습 목표: 첫소리 변별(FPR K Unit 1의 m·a·s·t). 오답 인형(c·d·f)으로 다른 첫소리와 구별한다. 아이가 말하는 단계는 없다.
- 플레이 인원: 1인. 2인·학급 모드 없음.
- 한 판 시간: 4라운드, 약 2~4분(추정 — 집게 동작과 정답 연출 시간으로 계산, 실측 아님). 실패가 많으면 코인이 떨어져 더 일찍 끝난다.

## 2. 게임 흐름
1. 로딩 바 → 타이틀(로고, 기계, 떠다니는 글자 동전·음표, START). 첫 터치에 BGM + "Hi, friends! Welcome to Toy Catch! … Press start to play!".
2. START(`startGame`, `js/game.js:1029`) → 카메라가 투입구로 가서 동전이 들어가고 기계 화면에 `INSERTED! / READY TO PLAY!` → "Ready? Let's play!" → 게임 화면, 코인 8개가 HUD로 들어온다.
3. 라운드(`nextRound`, `:1076`, m/a/s/t 무작위 순서): 목표 글자(Mm) + GO! + "Catch a friend that starts with /m/ … /m/". 1라운드에서 첫 터치 전이면 장갑 손이 조이스틱 → DOWN을 시범(`runHint`, `:1644`).
4. 조준: 조이스틱 드래그 · 기계 안 드래그 · 인형 탭(탭한 자리로) · ←→. 집게가 인형 머리 가운데 위에 오면 빛이 밝아지고 DOWN 버튼이 반짝인다.
5. DOWN(버튼 · Space/Enter/↓, `drop`, `:1111`) → 코인 1개 투입(`insertCoin`, `:1600`) → 집게가 조준한 자리로 그대로 내려감.
6. 판정(`AIM`, `:27`, 머리 가운데와의 거리): ≤0.2 확실히 잡음 · ≤0.4 헐겁게 잡혀 미끄러질 수 있음(35→85%) · ≤0.62 집게발이 머리를 쳐서 빈손 · 그 밖은 빈손.
7. 정답(`correct`, `:1243`): 색종이·불꽃놀이, 다른 인형 환호, 코인 +1 → 배출구 → 경품 통 카메라 → 상품 연출 "/m/ /m/ monkey" → 왼쪽 위 트레이 → 다음 라운드.
8. 오답(`wrong`, `:1391`): "Uh-oh! cat. It starts with /k/" → 인형 제자리 → "Try again! Listen." + 목표 음가. 빈손·미끄러짐은 상황별 대사 후 재시도.
9. 4라운드를 마치거나 코인이 0이면(`outOfCoins`, `:1627`, NO COINS!) 결과(`finish`, `:1436`) → 홈 / PLAY AGAIN.

## 3. 콘텐츠·데이터
| 구분 | 단어 | 개수 |
|---|---|---|
| 목표 첫소리 | m · a · s · t | 4 |
| 정답 인형 | monkey, mouse(m) · ant(a) · seal(s) · turkey, turtle(t) | 6 |
| 오답 인형(목표로 안 나옴) | cat, cow(c) · dog, duck(d) · fish(f) | 5 |

- 데이터 위치: `js/game.js:19-21`에 하드코딩(`LETTERS`, `POOL`, `OTHERS`). 레슨팩·엑셀은 쓰지 않는다.
- 한 판 배치(`setupPlushes`, `:765-777`): 6자리(뒷줄 선반 3 + 앞줄 볼풀 3, 지그재그) = m·a·s·t 각 1마리 + c/d/f 최소 1마리 + 나머지 1마리.
- 인형 그림: 사용자 제공 11종(`assets/img/friends/*.webp`, `js/friends-art.js`). 옷·모자에 첫 글자가 크게 찍혀 있다(예: monkey의 M).
- p 그림이 없어 p 라운드는 뺐다(사용자 결정). 다루는 범위는 Lesson 1만이 아니라 Lesson 1–4다.
- 다른 레슨 추가: 인형마다 그림 → 3D·회전 장면·포즈 파이프라인(9절)과 `POOL`/`OTHERS`, `build_voice.py` `WORDS` 수정이 필요해 비용이 크다. 레슨 선택 기능은 없다.

## 4. 레벨·난이도
- 한 판 4라운드 고정. 레벨·스테이지는 없다. 기계 화면의 "LEVEL 1 / M A S T"는 표시일 뿐이다(`:1473`).
- 타이머 없음. 코인이 기회 수를 정한다(`COINS {start: 8, win: 1}`, `:32`): 한 번 내릴 때마다 −1, 정답이면 +1, 빈손·오답은 추가 차감 없음. `?sec=N`이면 예전 라운드 시계가 켜진다(테스트용, `ROUND_SEC` `:22`).
- 적응형: 한 라운드에서 연속 2번 놓치면 다음 헐거운 잡기는 미끄러지지 않는다(`:1177`). 그 밖에는 없다.
- 정답 인형은 기계에서 빠지므로 라운드가 갈수록 고를 인형이 줄어든다(6마리 → 3마리).
- 아이·교사가 레벨이나 소리를 고를 수 없다. URL `?order=m,a,s,t`, `?kinds=…`로만 고정할 수 있다.

## 5. 보상·피드백
| 보상 | 획득 | 용도 | 저장 |
|---|---|---|---|
| 코인 | 시작 8, 정답 +1, 내릴 때마다 −1 | 기회 수. 결과 화면 큰 숫자 = 남은 코인(0이면 숨김) | 안 됨 |
| 잡은 친구 | 정답 인형 | 상단 트레이, 결과 화면 목록 | 안 됨 |
| 별 0~3 | 4마리 → 3, 2마리 이상 → 2, 1마리 → 1(`:1445`) | 결과 표시 | 안 됨 |

- 결과 화면: 하늘색 유리 카드, 제목(PERFECT! / GREAT JOB! / NICE TRY!, 젤리 글자), 금화 별 3자리, 남은 코인 카운트업, 잡은 친구와 단어(첫 글자 색 강조), 홈 · PLAY AGAIN(`index.html:216-217`). 정확도·시도 수 요약은 없다.
- 연출: 동전 투입·환불 금화 비행, 정답 색종이·불꽃·환호, 경품 통 카메라 샷, 상품 회전과 햇살, 인형 시그니처 포즈(`js/poses.js`), 결과 팡파르.

## 6. 튜터·음성·발음 판정
- 튜터: 화면에 보이는 튜터 캐릭터는 없다. 안내는 음성과 장갑 손 힌트로 한다. 인형들이 반응(환호, 고개 젓기, 포즈)한다.
- 안내 음성: `tools/build_voice.py` 기본 엔진 phonics-api TTS — Azure en-US-AvaMultilingualNeural을 'aiden' 목소리에 맞춰 조정(2026-11-20 통일). 공용 대사는 Magic Block·Croco에서 가져온다. 예전 회사 TTS는 `--engine qwen`.
- 단어·음가 음성: 공식 FPR K 녹음(Phonics Match에서 다듬은 것). monkey·mouse는 레슨팩 `FP.K.U1L1`, turkey는 Phonics Island의 L4 파일.
- 발음 판정: 없다. 마이크·음성 인식을 쓰지 않는다. phonics-api는 대사 음성을 만들 때만 쓴다.
- 목표 음가 다시 듣기: 상단 스피커 버튼(`#tgSnd`, `index.html:104`).

## 7. 화면·UI 요구사항
- 기준: 16:9 시안 기준. HUD 단위 `--u = min(1vh, 100vw/177.78)`, 기계 주변 단위 `--mu`(기계 화면 폭에서 계산, `layout` `:814`). 카메라가 기계 높이·폭에 맞춰 거리를 정하므로 4:3에서도 기계 전체가 보인다. 4:3·세로 전용 레이아웃과 iPad 크기 QA 스크립트는 없다.
- 상단 바: 왼쪽 코인 + 잡은 친구 트레이, 가운데 목표 글자 + 스피커, 오른쪽 EN/한 · 소리 · 나가기. 상자 높이 하나(`--hb` = 7.6u) — 1024×768에서 약 44 px(계산값). 2026-11-20 UI 표준의 기준 게임이다.
- 언어 토글: 안내 음성만 바뀌고 화면 글자는 영어 그대로다. 게임 화면에서만 숨기고 결과 화면에는 보인다(`css/style.css:502`).
- 조작: DOWN은 패널 위 3D 버튼에 투명 HTML 버튼을 겹친 것(`#drop`). 조이스틱 판정 영역 `#joyHit`. 인형 탭은 그림의 불투명 부분만 인정(64px 알파 격자).
- 예외 상태: 첫 터치 전에는 소리가 나지 않는다(브라우저 정책). 마이크·네트워크를 쓰지 않아 해당 예외가 없다. 움직임 줄이기 설정이면 금화 비행 없이 숫자만 바뀐다.
- 나가기(`:972-975`): 게임·결과 → 타이틀, 타이틀 → 뒤로 가기(기록이 없으면 무반응).

## 8. 기술 구성
- 스택: Vanilla HTML/CSS/JS, 빌드 없음. three.js r186 + RoomEnvironment·RoundedBoxGeometry·TextGeometry 등을 rolldown으로 묶은 `vendor/three.iife.js`(`tools/three-entry.js`). 글꼴 Baloo 2(`css/font.css` 내장). 기계 텍스처는 캔버스로 그리고 그림·음성·BGM은 base64라 `file://`로 열어도 동작한다.

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 마크업, HUD·결과 SVG(코인·별·시계) |
| `js/game.js` | 진행·조준·집게 판정·코인·결과·힌트·START 버튼 그리기 |
| `js/machine.js` | 기계(유리장·볼풀·선반·배출구·경품 통·집게·패널) |
| `js/stage.js` | 렌더러·조명·카메라 맞춤·트윈·투영·피킹 |
| `js/friends.js` · `friends-spin.js` · `friends-3d.js` · `friends-art.js` | 인형 표시 / 360° 회전 장면 아틀라스 / 3D 형상 / 그림(뒤 셋은 생성물) |
| `js/poses.js` · `js/rig.js` · `js/eyes.js` | 시그니처 포즈 / 관절 스프링 / 3D 눈 |
| `js/mats.js` · `js/fx.js` | 재질·캔버스 텍스처 / 2D 효과(색종이·불꽃·별) |
| `js/audio.js` · `voice.js` · `voice-data.js` · `bgm-data.js` | 음성·합성 효과음·BGM(뒤 셋은 생성물) |
| `js/font3d.js` | 3D 글자용 Baloo 2 서체 |
| `dev/friends3d.html` · `dev/eyes.html` | 인형·눈 확인용 |

- 실행: `python3 tools/serve.py 5231`(no-cache 서버) → http://127.0.0.1:5231/, 또는 `index.html` 직접 열기. `실행.command`는 없다.
- 배포: 공개 저장소, GitHub Pages(main `/`). push가 곧 배포. `design/sheets`·`art`·`turntable` 등 원본은 git에서 뺀다.
- URL 옵션: `?sec=N` `?order=` `?kinds=` `?nohint` `?joyhint=` `?nospin` `?flat` `?puff` `?sat=` `?pr=1` 등(비교·테스트용).

## 9. 에셋·생성 파이프라인
| 에셋 | 스크립트 | 실행 |
|---|---|---|
| 배경·로고·인형 그림·음표 | `tools/import_art.py` | `uv run --with pillow --with numpy --with scipy python tools/import_art.py [--friends --only <kind>] [--notes]`(다운로드 폴더에서 이름으로만) |
| 그림 없는 인형(오리) | `tools/sheet_front.py` | 캐릭터 시트 정면 → 로컬 Real-ESRGAN ×4 → 배경 제거 |
| 3D 형상 | `tools/make_3d.py`(+ `tsg_mesh.py` TripoSG, `mv_views.py` MV-Adapter, 모두 로컬) | `~/dev/tools/TripoSR/.venv/bin/python tools/make_3d.py --only <kind>` |
| 360° 회전 장면·포즈 프레임 | `tools/spin_frames.py`, `gif3d.py`, `turntable_parts.py`, `turntable_limb.py`(SAM 2.1 로컬) | 사용자 GIF·모션 그림(`design/`, git 제외)에서 생성 |
| 관절·부위·눈 | `tools/rig.py`, `parts_sam.py`, `eyes.py` | 3D 형상을 다시 만든 뒤 실행 |
| 음성 | `tools/build_voice.py` | `uv run --with numpy python tools/build_voice.py`(Magic Block·Croco를 먼저 빌드) |
| 음성 확인 | `tools/voice_check.py` | video-vision venv의 Whisper로 받아쓰기 대조 |
| BGM | `tools/make_bgm.py`(2026-11-22 8비트 아케이드 E 150 BPM, phonics-kit `bgm_engine.py`) | `uv run --with numpy --with scipy python tools/make_bgm.py` |

## 10. 저장 데이터
| 키 | 저장소 | 내용 |
|---|---|---|
| `claw-lang` | localStorage | 안내 음성 언어 `en`/`ko` |
| `claw-muted` | localStorage | 음소거 `1`/`0` |

- 저장 안 됨: 코인, 별, 잡은 친구, 진도. phonics-api 키도 쓰지 않는다.

## 11. QA
- headless Playwright + 실제 Chrome(Metal). 훅: `window.__claw`(상태), `window.__clawApi`(startGame/drop/finish), `Stage.frozen` + `Stage.step(dt)`로 프레임 고정. 이 문서를 쓰면서는 실행하지 않았다.

| 스크립트 | 검사 내용 / 통과 기준 |
|---|---|
| `tools/qa/flow.py <base> <out> [WxH]` | 타이틀 → START → 오답(cat) → 정답(monkey) → 2라운드, 스틸 13장(기본 1600×900, `?kinds`·`?order`·`?nohint` 고정) |
| `tools/qa/grab.py <base> <out> <kind>` | 프레임 고정으로 한 번 집는 순간 스틸 |
| `tools/qa/shot.py` | 스크린샷 + 콘솔 오류 출력 |
| `tools/qa/sheet.py` | 스틸 모음 시트 |
| push 전 통합 실행(스킬 규칙) | 타이틀 → START → 빈손 → 정답 → 결과 → PLAY AGAIN 한 스크립트, 콘솔 오류·400 이상 응답 없음 |
| 배포 후 | 공개 URL에서 `__ready`, START 동작, 콘솔 오류·400 이상 응답 없음 |

## 12. 알려진 이슈·보완 필요
- [높음] 공통 규칙(Skip·Jump): 인트로·설명 Skip 버튼 — 없음(안내 음성·손 시범). 모든 파닉스 게임에 넣는다(2026-11-22 규칙).
- [높음] 인형 옷·모자에 첫 글자가 크게 찍혀 있어, 소리를 듣지 않고 글자 모양만 맞춰도 풀린다.
- [높음] 말하기 단계가 없다. 다른 파닉스 게임과 달리 phonics-api 발음 판정을 쓰지 않는다.
- [높음] 1라운드에서 코인 8개를 다 쓰면 a·s·t를 보지 못하고 끝난다. 결과를 좌우하는 것이 소리 판단보다 조준(운동 기술)이다.
- [중간] 정답 인형이 빠지면서 라운드가 갈수록 쉬워진다(6마리 → 3마리).
- [중간] 별은 뽑은 개수만 본다. 7번 이하로 놓치면 누구나 별 3개라 정확도가 드러나지 않는다.
- [중간] 레벨·진도·저장이 없고 콘텐츠가 하드코딩(L1–4 고정)이다. 레슨팩을 쓰지 않고, 새 레슨을 넣으려면 인형마다 3D 파이프라인을 거쳐야 한다.
- [중간] 2라운드부터는 가만히 있어도 다시 알려주지 않는다. 대기 시간 `G.idle`은 쌓이기만 하고 쓰이지 않는다(`:882`).
- [낮음] 레벨이 없는데 기계 화면에 "LEVEL 1 / M A S T"가 뜬다(`:1473`, `js/machine.js:446`).
- [낮음] 오답 횟수 `G.tries`는 세기만 하고 쓰지 않는다(`:1413`).
- [낮음] 문서가 코드와 어긋난다: README의 "100점(첫 시도면 +50)"·Time's up·−10/−20 태그·"CATCH THE 'M'!" 배너, 카니발 BGM 설명, `game.js:5` "45 s per round", 스킬 QA 절의 "coins 100 → 210".
- [낮음] 언어 토글이 결과 화면에도 보인다(표준은 타이틀만). 화면 글자는 한국어로 바뀌지 않는다.
- [낮음] 4:3·iPad 크기 QA 스크립트가 없다.
- [낮음] 단독 탭에서 타이틀의 나가기 버튼이 반응하지 않는다(Croco는 창 닫기 → 새로고침으로 처리).
