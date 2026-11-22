---
id: word-mashup
title: Word Mashup 3D
title_ko: 워드 매시업
tagline: 그림카드 두 장을 부딪쳐 합성어를 만들고 따라 말해요
players: 1인
skill: 영어 합성어 만들기(sun+flower) + 합성어 따라 말하기 — 단어 단위, 낱자-소리 파닉스 아님
scope: 문법 · 합성어 43쌍(단어 단위 — 낱자-소리 파닉스 아님)
stack: Vite + TypeScript + Phaser 3 + three.js
repo: https://github.com/jinilee-hue/phonics-wordmashup-3D
url: https://jinilee-hue.github.io/phonics-wordmashup-3D/
updated: 2026-11-22
---

# Word Mashup 3D TRD

## 1. 개요
- 목적: 두 그림 낱말을 직접 합쳐 보며 영어 합성어를 익힌다. 기획 문서의 성공 기준은 "5세가 어른 도움 없이 6라운드 완주"(`wordmashup.md` 2절).
- 대상: 5~7세 한국 유치원생. 콘텐츠는 영어, UI는 영어·한국어 혼합.
- 학습 목표: 합성어 구성 인지(왼쪽 낱말 + 오른쪽 낱말 = 새 낱말)와 결과 낱말 발화.
- 플레이 인원: 1인. 2인·학급 모드 없음.
- 한 판 시간: 6라운드, 약 3~5분(추정 — 연출·대사 타이밍으로 계산, 실측 아님). 인트로 영상 별도.
- 이력: 2D 원본 `jinilee-hue/phonics-wordmashup`을 복제한 3D판. Phaser가 규칙·HUD, three.js(`src/gl/`)가 3D를 맡는다.

## 2. 게임 흐름
1. 인트로 영상(`videos/intro.mp4`) — 2초 뒤 SKIP, 끝나면 START(`src/main.ts`).
2. 로딩(`BootScene`) → `GameScene`.
3. 라운드 시작: 좌·우 카드 3장씩 등장. 글리가 "Which two go together?" 후 6.5초 듣는다(첫 판은 인사·사용법 먼저).
4. 아이 입력: 좌 1장 + 우 1장을 끌거나 탭해서 존에 넣는다. 또는 말한다(글리에게 대답 / Mic 버튼).
5. 판정(`GameScene.checkMatch`):
   - 정답 → 충돌 연출 → 결과 카드 + 보상 → "Pan and cake make... pancake!" → "Say it with me!"(5초 듣기, 못 들으면 한 번 더) → 칭찬 → 공간 이동 → 다음 라운드.
   - 오답 → 붉은 플래시·✗ + 글리 음성 안내 → 다시 시도(제한 없음).
6. 6라운드 후 결과 화면 Compound Book → Next Play = 새 판(`scene.restart()`).

## 3. 콘텐츠·데이터
| 항목 | 내용 |
|---|---|
| 합성어 | 43쌍 — 원래 30 + 2026-10-27 교재 합성어 13(backpack, basketball, mailbox, playpen, popcorn, raincoat, shoelace, treetop, wheelchair, peanut, spaceship, starlight, windmill) |
| 데이터 위치 | `src/data/compounds.ts:11-55` 하드코딩(`word1, word2, result, icon1/icon2/iconResult`(이모지 폴백), `pron`) |
| 카드 그림 | `Word Mashup/Images/` — 왼쪽 낱말 36장, 오른쪽 37장, 결과 43장 / 3D 앞면 `public/gl/cards/*.webp` 73장 |
| 레슨팩 | 사용 안 함 |
| 기획 엑셀 | `Phonics/WordMashup_교재합성어_카드제작목록.xlsx` — 「SAD·FPR 단어 연구 자료집 v1.0」 기준, 교재 단원 SAD A U6 L174·SAD B U5 L62. 기존 30개 중 7개는 교재에 없음(빼기 검토), 2차 후보 112개 / `WordMashup_튜터대사_상황별.xlsx` — 글리 대사 426줄 |

- 보기 카드 규칙: 화면의 좌·우 카드로 만들 수 있는 합성어가 정답 하나뿐이 되도록, 중복 없이 고른다(`GameScene.ts:1185-1216`).
- 다른 레슨(단어) 추가 절차(`README-3D.md`):
  1. `card_left_<낱말>.png`, `card_right_<낱말>.png`, `card_<합성어>.png`를 `Word Mashup/Images/`에 넣는다(낱말 443×580, 결과 297×373).
  2. `COMPOUND_PAIRS`에 한 줄 추가.
  3. `tools/unwarp_cards.py`로 3D 앞면 생성.
  4. `tools/build_glee_voice.py`로 새 대사 생성.
  - 레슨 단위 묶음·선택 기능은 없다.

## 4. 레벨·난이도
- 한 판 6라운드 고정(`GameScene.ts:6`), 43쌍에서 무작위(`compounds.ts:73-75`, `sort(() => Math.random() - 0.5)`).
- 레벨·스테이지 없음. 라운드마다 바뀌는 것은 단어뿐.
- 타이머 없음. 무입력 15초 → 글리가 카드를 가리킴, 28초 → 힌트(`tutor.ts:40`).
- 적응형 난이도 없음. 한 라운드 안에서 오답 횟수에 따라 도움이 커진다(1회 다시 해 보자 → 2회 첫 카드를 대신 넣음 → 3회 힌트).
- 아이·교사가 레벨을 고를 수 없음. 교재 단계(K/A/B) 정보는 엑셀에만 있다.

## 5. 보상·피드백
| 보상 | 획득 | 용도 | 저장 |
|---|---|---|---|
| 별 | 정답 +10 | 없음 | 안 됨(판마다 0) |
| 코인 | 정답 +15 | 힌트 −5(5개 미만이면 힌트 버튼 회색, 2026-11-22) | 안 됨 |
| 보석 | 정답 +3 | 없음 | 안 됨 |
| 하트 | 시작 3 | 틀린 짝 −1, 0이면 판 끝 → 결과(2026-11-22) | 안 됨 |
| 도감 카드 | 맞힌 합성어 | Compound Book 채우기 | `phonics_collected_v1` |

- 상단 배지의 `+` → 재화 안내 모달(`GameScene.ts:1998-2008`: 힌트 −5, 별 100→동전 1, 보석으로 카드 소환 등). 문구만 있고 동작은 미구현.
- 결과 화면(`GameScene.ts:2156-2433`): 왼쪽 = 이번 판 합성어 6장(새 카드는 팝인 + 파티클), 오른쪽 = 못 모은 카드(회색 '?', 6장씩 페이지), `N / 43`, 다 모으면 "All Collected!", Next Play 버튼. 점수·정답률 요약 없음.
- 축하 연출: 카드 충돌(`mashup.ts`), 별·코인·보석이 칩을 거쳐 점수판으로 날아감(`reward.ts`), 라운드 사이 공간 이동(`travel.ts`), 글리 환호(점프·하트·별), 마지막에 "Wow! You made six new words!". 움직임 줄이기 설정·2D 모드는 원래 2D 연출.

## 6. 튜터·음성·발음 판정
- 튜터: 글리(Glee) — 셰이더 레이마칭 캐릭터(`glee.ts`), 위 노랑·아래 민트. 길게 눌러 끌면 위치를 옮기고 기억한다. 2D 모드에는 없다. 각 게임 자체 튜터 유지 결정(2026-11-20)에 해당.
- 튜터 음성: 대사 426줄을 미리 만든 mp3(`public/gl/voice/`). 회사 phonics-api TTS의 en-US-AnaNeural, ffmpeg로 음높이 ×1.035·빠르기 0.95, 낱말 시점은 whisper. 말풍선 없이 영어 음성만, LLM 대화 없음(고정 문장 + 고정 응답).
- 낱말 음성: 별도 공식 음원 없음. 글리 대사(`w_<낱말>`, `r_<합성어>`)가 그 역할.
- 음성 인식(`src/gl/apiSR.ts` 녹음 → `src/gl/sayJudge.ts`, 브라우저 음성 인식은 쓰지 않는다 — 2026-11-22):

| 조건 | 인식기 |
|---|---|
| 기기에 phonics-api 키 있음 + 서버 사용 가능 | 직접 녹음(150 ms 소리로 시작, 0.7 s 조용하면 끝, 최대 8 s) → 16 kHz WAV → `/v1/speech/transcribe` → 텍스트 |
| 키 없음 / 오프라인 / 서버 실패 | 같은 녹음을 기기 안 whisper(tiny.en, `src/gl/stt.ts`)가 받아씀 — 목소리는 기기 밖으로 안 나감 |
| 둘 다 없음 | `NoSR` — 오류 처리, 터치로만 진행 |

- 판정: 받아쓰기 텍스트 매칭. 글리는 낱말 단위 일치 + 합성어 Levenshtein 1~2자 허용(`tutor.ts:58-69`), Mic 버튼은 부분 문자열 `includes`(`GameScene.ts:1052`). phonics-api analyze/judge는 쓰지 않는다.
- 따라 말하기 결과는 점수에 반영되지 않는다(못 해도 "Nice try!" 후 넘어감).

## 7. 화면·UI 요구사항
- 기준: 디자인 좌표 1280×720, `Phaser.Scale.RESIZE`. 위치는 가로·세로 비율로 각각, 크기는 작은 쪽 배율로 맞춘다. 4:3에서는 세로로 벌어지고 카드가 작아진다(레터박스 없음). 세로 화면 대응 없음. QA는 1180×820 터치 기준.
- 상단 바: 뒤로(판 재시작) · Compound Book 진행 바(`1 / 6`, 누르면 도감) · 별/코인/보석 배지 + `+` · 톱니(설정: BGM·SFX 토글, 발음 인식 서버 키).
- 하단 버튼: Replay(판 전체 재시작), Mic, Hint(무료·무제한), Home(페이지 새로고침 → 인트로부터).
- 언어 토글: 타이틀에만 있고, 처음엔 한국어. 튜터 음성과 말풍선만 바뀌고 화면 글자는 두 언어 모두 영어(파닉스 공통 규칙). 타이틀은 인트로 영상이라 토글은 톱니 버튼 아래에 놓인다. 페이지 제목은 "Prompt Crash — Compound Word Game"(`index.html:6`).
- 터치: 하단 버튼 162×58(디자인 px), 배지 `+`는 4:3에서 약 36 px(추정 계산). 카드는 거리 기반으로 잡는다.
- 예외 상태: 마이크 거부 → 글리는 듣지 않고 터치로 진행, Mic 버튼은 안내 없이 꺼짐. 오프라인 → 기기 안 whisper로. 느린 기기 → 품질 high → mid → low → 2D 자동 하향(`gl/index.ts`), 2D에는 글리 없음.
- URL 옵션: `?q=high|mid|low|2d`, `?glee=off`, `?tutor=off`, `?fps`, `?debug` 등(`README-3D.md`).

## 8. 기술 구성
- 스택: Vite 8 + TypeScript 5 + Phaser 3.88 + three.js 0.180. 폰트 Baloo 2·Noto Sans KR(Google Fonts). 개발용 playwright.

| 파일 | 역할 |
|---|---|
| `src/main.ts` | 인트로 영상, Phaser·3D 시작 |
| `src/scenes/GameScene.ts` | 규칙·HUD·판정·도감·결과 화면 |
| `src/data/compounds.ts` | 합성어 43쌍, 라운드 선택 |
| `src/audio.ts` | BGM(인트로 영상 오디오), SFX(Web Audio) |
| `src/gl/index.ts` | 3D 연결, 품질 단계, 글리 위치 |
| `src/gl/stage·cards3d·zone3d.ts` | 배경·카드·Gravity Zone |
| `src/gl/mashup·reward·travel.ts` | 충돌·보상·공간 이동 연출 |
| `src/gl/glee·tutor·gleeVoice.ts` | 글리 모델·대화·대사 데이터 |
| `src/gl/apiSR.ts`, `src/vendor/phonics-api.js` | phonics-api 받아쓰기·키 입력 |
| `worldb.html` | 3D 월드 B안 시안(본편 아님) |

- 실행: `실행.command`(http://127.0.0.1:5183/) 또는 `npm install && npx vite --port 5183`.
- 빌드: `npm run build` → `dist/`. vite 플러그인이 `Word Mashup/Images/`와 인트로 영상을 `images/`·`videos/`로 복사.
- 배포: `.github/workflows/deploy.yml` — main push 시 GitHub Pages 공식 Actions로 빌드·배포.

## 9. 에셋·생성 파이프라인
| 에셋 | 스크립트·출처 | 실행 |
|---|---|---|
| 카드 그림 원본 | `Word Mashup/Images/` (제작 도구 기록 없음) | — |
| 3D 카드 앞면 | `tools/unwarp_cards.py` | `uv run --with pillow --with numpy python tools/unwarp_cards.py [--debug DIR] [left_<낱말> right_<낱말> …]` |
| 배경 깊이 지도 | `tools/build_depth.py`(Depth Anything V2 Small, 로컬) | `uv run --with torch --with transformers --with pillow --with numpy python tools/build_depth.py` |
| 글리 음성 | `tools/build_glee_voice.py`(phonics-api TTS, 키는 로컬 설정 파일에서 읽음) | `uv run --with numpy python tools/build_glee_voice.py` / 예전 목소리 `--engine edge` |
| 인트로 영상·배경 4층 | Veo 영상 마크 제거·레이어 분리(스크립트는 저장소 밖) | — |
| BGM / SFX | 인트로 영상 오디오 / Web Audio 합성 | — |

## 10. 저장 데이터
| 키 | 저장소 | 내용 |
|---|---|---|
| `phonics_collected_v1` | localStorage | 모은 합성어 배열(도감) |
| `wm3d-glee-spot-v1` | localStorage | 글리 위치(1280×720 좌표) |
| `wm3d-quality-v2` | localStorage | 낮춘 품질 `{mode, until}`, 24시간 뒤 재확인 |
| `wm3d-2d` | sessionStorage | 2D로 포기한 상태(탭 세션 동안) |
| `phonics_api_key` | localStorage | 기기별 phonics-api 키(값은 문서·저장소에 적지 않음) |

- 판 결과(만든 단어·말한 단어·별·코인·보석·시간)는 공통 기록(`phonics.progress`)에 남긴다(2026-11-22). BGM·SFX 토글은 저장 안 됨.

## 11. QA
- 공통: `tools/qa/`, 개발 서버 대상 headless Chrome. `?q=high` 필수(SwiftShader면 2D로 떨어짐). 이 문서 작성 중에는 실행하지 않았다.

| 스크립트 | 검사 내용 | 통과 기준 |
|---|---|---|
| `regress.py` | 2D 폴백, 3D 위 도감, 1180×820 터치 라운드 | 명시 없음 |
| `wm3d_travel.py` | 공간 이동, 결과 화면까지 한 판 | 명시 없음 |
| `new_cards.py` | 지정 합성어 라운드 | 그림·음성 4xx/5xx 없음, 결과 카드 표시, 페이지 오류 없음 |
| `replay_win.py` | 정답 → Replay → 정답 | 오류 없음, 정답마다 보상 1회, HUD 10/15/3 |
| `tutor_flow.py`, `tutor_guide.py` | 글리 대화·오답 안내(가짜 음성 인식) | 한 번에 한 명만 말함 |
| `api_sr.py` | Mic·글리 인식(`api`/`device`), 설정 화면 | 명시 없음 |
| `glee_move.py` | 글리 옮기기·위치 유지 | 명시 없음 |
| `quality_check.py` | 자동 품질(실제 GPU) | 3D 유지 |

## 12. 알려진 이슈·보완 필요
- [반영] 말하기 JUMP(2026-11-22): 결과 카드 모서리 초록 JUMP, 누르면 그 단어 보상 없음. 첫 조용한 차례에 Glee가 가리키고 장갑·"Want to skip? Tap the jump button!" 안내. 보상은 단어를 말해야 나온다.
- [높음] 진도·레벨 없음 — 6라운드 무작위, 교재 단계(K/A/B) 미반영, 적응형 없음, 레벨 선택 불가.
- [높음] 재화에 용도가 없음 — 별·코인·보석은 쓸 곳이 없고 판마다 0으로 돌아간다. `+` 안내 모달의 약속(힌트 −5, 교환, 소환)이 미구현.
- [높음] 진행 손실 — Replay·뒤로·Next Play가 모두 판 전체를 다시 시작하고 확인창이 없다. Home은 새로고침이라 인트로부터. 기획 문서는 Replay를 "현재 라운드 재배치"로 적고 있다.
- [높음] 파닉스 공통 규칙과 불일치 — 레슨팩 미사용(규칙 2b), 대표이미지 대신 자체 카드 그림(규칙 2). 단어 하나 추가에 그림 3장 + 스크립트 2개.
- [중간] 2D 폴백(느린 기기)에서 글리·음성 안내가 사라지고 한국어 글자 토스트만 남는다.
- [반영] 판정 통일(2026-11-22): phonics-api analyze + judge(합성어 소리표), 기기 안 whisper는 엄격한 백업(브라우저 인식은 없앰), 판정 불가면 보상 없음. TTS 측정: 한국어 억양 정답 21→67 %, 반쪽 단어·잡음 통과 0. Glee 목소리도 통일 튜터 목소리로 바꿈.
- [중간] 마이크 거부 시 Mic 버튼에 안내가 없다. `GameScene.ts:961`의 "음성 인식 미지원" 토스트는 HybridSR이 늘 정의돼 있어 실행되지 않는다.
- [중간] 결과 화면에 점수·정답률·힌트 사용 요약이 없고, 교사·부모용 기록·설정이 없다.
- [중간] 반복 동기가 도감뿐인데 못 모은 카드에 가중치가 없고, 셔플이 `sort(random)`이라 편향된다.
- [반영] 언어 토글 추가, Glee 한국어 대사, 화면 글자 영어(2026-11-22).
- [낮음] 오답 연출(붉은 플래시·화면 흔들림·빨간 ✗)이 5~7세에게 강하다.
- [낮음] 4:3에서 `+` 버튼 약 36 px(추정), viewport 확대 제한 없음, 세로 화면 대응 없음. BGM·SFX 설정이 저장되지 않는다.
- [낮음] 도감 키 이름 `phonics_collected_v1`이 범용이라 같은 출처(jinilee-hue.github.io)의 2D 원본 등과 섞일 수 있다(추정).
- [낮음] 기존 7개(moonlight, fireplace, handbag, doorbell, keyboard, watermelon, lighthouse)는 교재에 없음 — 엑셀 "빼기 검토".
- [낮음] 이름 잔재(제목 "Prompt Crash", 패키지 `compound-crash`), `wordmashup.md` 낡음(30종·Back 버튼, 2026-07-06), `README.md`는 2026-11-22에 새로 썼다(`README-3D.md`는 3D 상세). 배경 4층·인트로 마크 제거 스크립트가 저장소 밖.
