---
id: phonics-match
title: Phonics Match
title_ko: 파닉스 매치
tagline: 같은 그림 3개를 맞추고 첫소리와 단어를 따라 말해 코인 모으기
players: 1인
skill: 첫소리+단어 듣고 따라 말하기(/m/ /m/ monkey), 글자와 소리 연결
scope: FPR K 전체(Unit 1–6 첫소리) · 동물·사물·과일 3주제, 교재 단어와 공식 녹음
stack: Vite + TypeScript (DOM·CSS·Canvas 2D, 기기 안 인식 transformers.js whisper-tiny.en)
repo: https://github.com/jinilee-hue/Phonics-Match
url: https://jinilee-hue.github.io/Phonics-Match/
updated: 2026-11-22
---

# Phonics Match TRD

## 1. 개요
- **목적**: FPR K 낱말 그림으로 하는 매치3 퍼즐에 첫소리와 단어 따라 말하기를 붙인 게임이다. 말하면 코인을 받고, 코인으로 튜터를 꾸민다.
- **대상 연령**: 5~7세(유치원).
- **학습 목표**
  - 그림이 터질 때 튜터가 "/x/ /x/ word"를 읽어 주고, 아이가 따라 말한다. 첫소리를 반복한 뒤 단어를 말해도 통과한다.
  - 터질 때마다 글자 배지와 금빛 글자가 나와 글자와 소리를 이어 준다.
  - 단, 맞추기 자체는 **같은 그림** 기준이라 소리를 판단할 필요가 없다. 레벨 클리어도 말하기와 무관하다(`game.ts:131`).
- **플레이 인원**: 1인.
- **한 판 시간**: 한 레벨 3~6분(추정). 이동 15~20회이고, 이동마다 말하기 차례가 있다. 레벨 수에는 끝이 없다.

## 2. 게임 흐름
1. 로딩: 배경·로고·튜터 그림을 먼저 받는다. whisper 모델은 1.5초 뒤 백그라운드에서 받기 시작한다.
2. 타이틀
   - 글자 7개가 로고 둘레를 돈다.
   - 첫 터치에 음악, 튜터 인사, 시연 보드 내레이션이 나온다. 시연 중에는 SKIP을 누를 수 있다.
   - 아무것도 누르지 않으면 25초 뒤 조용히 다시 시연한다.
   - 튜터 오른쪽 아래에 드레스업 버튼이 있다.
3. PLAY를 누르면 테마 카드가 열린다(동물·과일·사물, 처음에는 항상 동물 선택). 튜터가 "하나를 골라 봐!"라고 말하고, Play를 누르면 시작한다.
4. 미션 카드: 'Level N'과 목표(글자별 개수)가 나온 뒤 "Ready? Let's go!"와 함께 시작한다.
5. 한 이동(핵심 루프)
   1. 그림 두 개를 스왑한다. 줄이 안 맞으면 되돌아가고, 이동 수는 줄지 않는다.
   2. 줄이 맞으면 이동이 1 줄고, 그림이 터진다. 연쇄가 생기면 Combo가 나오고, 미션 글자가 집계된다.
   3. 첫 웨이브에서 가장 큰 그룹 하나만 튜터가 읽는다("Wow! /m/ /m/ monkey").
   4. 말하기 카드와 마이크가 나오고, 그동안 보드는 잠긴다.
   5. 결과에 따라 다음처럼 끝난다.
      - 통과: +10 코인
      - 2번 틀림: "Good try!", 코인 없음
      - 무음 2번: 약 20초 뒤 닫힘, 코인 없음
      - 점프 버튼: 바로 넘어감, 코인 없음
   6. 보드 잠금이 풀린다. 움직일 수 있는 수가 없으면 자동으로 섞는다.
6. 목표를 다 채우면 클리어, 이동이 0이 되면 실패다. 이어서 결과 카드가 나온다.
7. 결과 카드: 별, 코인, Home · Dress up · Retry(실패 시) 또는 Next(클리어 시).
8. 드레스룸: 코인으로 아이템을 사서 입히고 벗긴다.

## 3. 콘텐츠·데이터
| 테마 | 보드(유닛 순서, 빈칸 = 이전 유닛 복습 글자) | 단어 수 | 단어 |
|---|---|---|---|
| Animals | U1 m a s t p · U2 i c f d + 복습1 · U3 h o r b l · U4 e g x + 복습2 · U6 z + 복습4 | 25 | monkey/mouse, ant, seal, tiger/turtle, pig/puppy, iguana, cat/cow, fish, duck/dog, hen/horse, octopus, rat, bear/bee, lion, elephant, goat, fox(x = 끝소리), zebra |
| Things | U1~U6 6보드(U3은 o가 없어 복습1) | 39 | mug, mop, ax, sock, soap, tent … umbrella, jet, jar, quilt, yarn, zipper |
| Fruit | 1보드 a g l p w | 6 | apple, grape, lemon, peach, pear, watermelon |

- **출처**
  - 단어·보드·허용 표현(`ALTS`)은 `src/data/animals.ts`에 하드코딩돼 있다(`THEMES`, 22~56행).
  - 단어 음성은 모두 공식 녹음이다(FPR K manifest, Constella 승인 자산). 이 중 monkey mouse fox mug mop doll kite egg gift와 /m/은 레슨팩 FP.K.U1L1 음성이다(`tools/pack_voice.py`).
  - 글자 소리는 FPR K 공식 녹음이다.
- **타일 그림**: 3D 클레이 그림(`public/art/a_*`, `o_*`, `f_*`, Gemini 생성)이다. 공통 규칙상 보드 타일은 대표이미지 대상이 아니다.
- **데이터 파일**: `src/data/animals.ts`, `phonemes.json`(70단어 기대 소리열), `voice.json`(160 클립), `mouth.json`, `art.json`, `deco.json`.
- **U1L1 "Mm"과의 관계**: Unit 1 보드는 m 하나가 아니라 m·a·s·t·p 다섯 글자로 이루어진다. Lesson 1만 따로 하는 모드는 없다. 스킬 문서에 따르면 pig는 FPR K Unit 4~6 단어다.
- **다른 레슨 추가**: 레슨팩 manifest를 읽는 로더가 없다. 다음 순서로 수작업한다.
  1. 타일 그림 준비(`tools/tiles.py`, `build_art.py`)
  2. `animals.ts`의 letters/units/ALTS 수정
  3. `build_voice.py`로 음성 만들기
  4. `build_mouth_cues.py`, `voice_ver.py`
  5. `build_phonemes.py`
  6. `check_fprk.py`, `tools/qa/word_check.ts`로 확인

## 4. 레벨·난이도
| 테마 | 레벨 수(고정) | 이후 |
|---|---|---|
| Animals | 5보드 × 6 = 30 | 자동 생성 미션이 끝없이 이어짐 |
| Things | 6보드 × 6 = 36 | 같음 |
| Fruit | 1보드 × 6 = 6 | 같음(보드는 계속 같은 하나) |

- **유닛 안 6레벨**(`animals.ts:169-185`)
  - 이동 15에서 20으로 늘어난다.
  - 목표는 1글자 6개 → 2글자 → 3글자 5~6개씩으로 늘어난다.
  - 목표 글자가 나올 확률 보정(bias)은 0.12에서 0.05로 줄어든다.
  - Unit 6(Animals)은 z가 모든 미션에 들어가는 REVIEW 패턴을 쓴다.
- **자동 생성 레벨**(`animals.ts:186-199`): 목표 2~3글자, 글자당 6개에서 최대 14개, 이동은 22에서 16으로 준다.
- **별**: 남은 이동 34% 이상이면 3개, 12% 이상이면 2개, 그 밖에는 1개다(`game.ts:352`).
- 시간 타이머는 없고 이동 수 제한만 있다. 듣기 창은 6초이고, 무음 뒤 다시 9초를 기다린다.
- 적응형 난이도는 없다.
- **레벨 선택 불가**: PLAY는 테마별 최고 도달 레벨에서 다시 시작한다(`main.ts:140`). Retry/Next만 있고, `?level=`은 QA용이다.

## 5. 보상·피드백
| 보상 | 조건 | 용도 |
|---|---|---|
| 코인 +10 | 말하기 차례 통과(`game.ts:18`) | 드레스룸 아이템 구매 |
| 코인 20/25/30 | 레벨 클리어(15 + 별 × 5) | 같음 |
| 별 1~3 | 레벨 클리어 | `save.best`에 저장되지만 화면 어디에도 표시되지 않음 |
| 아이템 | 코인 구매 | 튜터 꾸미기. 2D 11종 합계 710코인. 학사모는 무료. 헤드폰 70코인은 3D 모드(`?tutor=3d`)에서만 보임(`items.ts:23-46`) |

- **축하 연출**
  - 터질 때 솜 퍼프, 글자 배지, 빛살
  - 미션 칸으로 날아가는 금빛 글자와 사탕 버스트(`ui/fx.ts`)
  - Combo N!
  - 클리어 confetti, 코인 날아가기
  - 아이템 착용 모션과 튜터 반응
- **결과 카드**
  - 별(클리어 시)
  - 제목 'Mission Clear!' 또는 'Out of Moves!'(영어 고정)
  - +코인
  - Home / Dress up / Retry 또는 Next
  - 그 판에서 말한 단어 목록은 없다.
- **저장**: `pm-save-v1`(10절).

## 6. 튜터·음성·발음 판정
- **튜터**: 학사모를 쓴 노란 털뭉치다. 2D 그림에 캔버스로 입을 그린다(`ui/tutor.ts`, `ui/mouth.ts`, Rhubarb 입모양).
  - 미리보기로 `?tutor=3d`를 붙이면 3D 튜터(`public/t3d`, three.js iframe)가 나온다. 아이템도 3D로 입고 드래그로 돌릴 수 있다.
- **튜터 음성**: 대사 32줄 × 영어·한국어. `voice.json` 기준 엔진은 `phonics-api`, 목소리는 `en-US-AvaMultilingualNeural`이다. 높이·빠르기를 'aiden'에 맞췄다(EN ×1.109/×1.035, KO ×1.030/×1.169). 기본 언어는 한국어다(`core/lang.ts:5`).
- **배경음악**: `tools/make_bgm.py`로 만든 'bubble pop'(E♭, 128 BPM, 30초)이다.
- **발음 판정**(`core/listen.ts`)
  1. 기기에 키가 있으면 phonics-api `/v1/speech/analyze`로 보낸다(녹음은 저장하지 않음). `PhonicsAPI.judge`가 단어를 판 위 다른 단어 및 같은 글자 단어와 비교한다(`core/apiCheck.ts`).
     - ok → 통과
     - wrong/unclear이면서 rel ≤ 0.7 → 틀린 시도("Almost!")
     - 그 밖 → 시도로 치지 않고 다시 읽어 줌
  2. 키가 없거나 오프라인·혼잡·6초 초과면 기기 안 whisper-tiny.en이 판정한다. 기준값은 RULE gap 6 / rgap 2 / minT −7.5 / maxNo 0.5이고, `lastPart.ts`로 끝부분을 한 번 더 본다.
  3. 옆 사람 말처럼 단어와 거리가 먼 소리는 시도로 치지 않는다(`triedWord`).
  4. whisper가 30초가 지나도 로딩 중이거나 오류이면 'nomic'으로 처리하고 코인을 주지 않는다.
- **키 관리**: 타이틀 왼쪽 위 열쇠 버튼으로 교사가 입력한다. 코드와 repo에는 넣지 않는다. 점 색은 초록 = 서버, 회색 = 기기 안 판정이다. `?debug`를 붙이면 시도별 결과가 화면에 표시된다.

## 7. 화면·UI 요구사항
- **기준 해상도**: 2752×1536 디자인 스테이지를 창에 맞춰 축소하고(`ui/stage.ts`), 남는 곳은 레터박스로 둔다. HUD는 창 위쪽에 붙고, 왼쪽 열(코인·드레스업·미션 카드)은 창 높이 가운데에 온다.
- **4:3 iPad(1024×768)**: 축척 약 0.372다. CSS로 계산한 크기는 다음과 같다.
  - 상단 버튼 약 43px
  - 점프 버튼 약 44px
  - 마이크 약 74px
  - 보드 칸 약 100px

  세로 비율이 4:5보다 좁으면 '돌려 주세요' 오버레이가 나온다(`style.css:555`).
- **상단 바**
  - 타이틀: 왼쪽 열쇠 · 오른쪽 언어 토글(라운드박스 국기) · 음소거 · 나가기
  - 게임: 음소거 · 나가기
  - 볼륨 막대는 없고 음소거 토글만 있다(`ui/corner.ts`).
- **언어**: 타이틀에서만 바꿀 수 있고, **튜터 음성만** 바뀐다(`core/audio.ts:16`). 화면 글(Level, Moves, Mission Clear!, Dress Up, 테마 이름, 아이템 이름)은 영어 고정이고, 대사 자막은 없다.
- **나가기**: 게임에서는 한 번 탭하면 타이틀로 간다. 타이틀에서는 이전 페이지가 있을 때만 `history.back`하고, 새 탭에서는 아무 일도 하지 않는다.
- **예외 상태**
  - 마이크 거부·미지원·권한 창 무응답: 말하기 차례를 매번 바로 닫는다. 대체 확인 수단은 없다.
  - 오프라인·키 없음: whisper가 판정한다(모델 55MB가 `public/stt`에 들어 있음).
  - 이동 처리 중이거나 말하기 카드가 떠 있을 때 드레스업을 누르면 막히고 버튼이 흔들린다.
- `prefers-reduced-motion`에 대응한다.

## 8. 기술 구성
- **스택**: Vite 7, TypeScript 5.9, @huggingface/transformers 4.3(whisper). 게임 엔진 없이 DOM, CSS, WAAPI, Canvas 2D(이펙트)로 만들었다. 3D 튜터는 `public/t3d`(three.js) iframe 복사본이다.

| 파일 | 역할 |
|---|---|
| `src/main.ts` | 부팅, 화면·카드 전환, 테마 카드, 결과, 드레스업 연결, 테스트 훅 `window.__pm` |
| `src/game/game.ts` · `grid.ts` · `board.ts` | 레벨·스왑·연쇄·말하기 차례·힌트 / 매치 논리 / 보드 표시·입력(5×4) |
| `src/data/animals.ts` | 테마·유닛·단어·ALTS·rivals·레벨 표 |
| `src/core/listen.ts` · `mic.ts` · `stt.ts` · `sttWorker.ts` · `sttCheck.ts` · `lastPart.ts` · `apiCheck.ts` | 말하기 판정 파이프라인 |
| `src/core/audio.ts` · `speech.ts` · `lang.ts` · `store.ts` | 소리 / 대사 / 언어 / 저장 |
| `src/ui/title.ts` · `demo.ts` | 타이틀 글자 궤도 / 시연 보드 |
| `src/ui/tutor.ts` · `mouth.ts` · `shop.ts` · `items.ts` | 튜터·립싱크·3D 연결 / 드레스룸 / 아이템 표 |
| `src/ui/fx.ts` · `hud.ts` · `hand.ts` · `corner.ts` · `stage.ts` | 이펙트 / HUD / 힌트 손 / 상단 바 / 화면 맞춤 |
| `src/vendor/phonics-api.js` | phonics-kit 복사본 |

- **실행**: `npm ci` 후 `npm run dev`(포트 5197 strictPort). `?tutor=3d`를 개발 서버에서 쓰려면 `../Phonics-Match-3D`를 :5198에 띄워야 한다.
- **빌드**: `npm run build`(`tsc --noEmit && vite build`, base `./`). `vite preview`의 포트 5198은 3D 서버와 겹친다.
- **배포**: main에 push하면 `.github/workflows/deploy.yml`(Node 22)이 GitHub Pages에 올린다. 3D를 바꾸면 `sh tools/sync_t3d.sh`로 복사한 뒤 커밋한다.
- **테스트 URL**: `?fake=1` `?seed=` `?log=1` `?level=` `?play` `?theme=` `?tutor=3d` `?t3d=` `?debug`

## 9. 에셋·생성 파이프라인
| 스크립트 | 산출물 | 실행 |
|---|---|---|
| `tools/cut_sprites.py` · `art_boxes.py` · `matte.py` | 목업에서 스프라이트 누끼 | `uv run --with "rembg[cpu]" --with pillow --with numpy --with scipy python tools/cut_sprites.py <names>` |
| `tools/build_art.py` | 타일·타이틀·배경 webp → `public/art/` | `uv run --with pillow --with numpy --with scipy python tools/build_art.py <animals\|title\|bg>` |
| `tools/tiles.py` | 타일 얼굴 크기 맞춤(`design/tiles/built.json`) | `build_art.py animals` 뒤 실행 |
| `tools/title_deco.py` · `letter_counters.py` | 타이틀 별·선 장식 / 글자 구멍 투명 처리 | `build_art.py`가 호출 |
| `tools/clean_bg.py` · `final_bg.py` · `membrane.py` | 배경 정리(LaMa, 라플라스 채우기) | 배경 변경 시 |
| `tools/star_shadow.py` · `feet_mask.py` · `refit_wear.py` | 결과 별 그림자 / 신발 아래 발 마스크 / 옛 헤드셋(미사용) | |
| `tools/build_voice.py` | 튜터 대사·단어 음성 → `public/voice/`, `voice.json` | `uv run --with numpy python tools/build_voice.py` |
| `tools/pack_voice.py` · `build_mouth_cues.py` · `voice_ver.py` | 레슨팩 음성 / 입모양 / 캐시 버전 | 음성 변경 뒤 이 순서로 |
| `tools/build_phonemes.py` | 기대 소리열 → `phonemes.json` | `python3 tools/build_phonemes.py` |
| `tools/make_bgm.py` | 배경음악 → `public/bgm.mp3` | |
| `tools/check_fprk.py` · `check_unit1.py` · `check_animals.py` | 보드 단어가 FPR K 장부에 있는지 확인 | `python3 tools/check_fprk.py`(없으면 exit 1) |
| `tools/sync_t3d.sh` | 3D 튜터 복사 → `public/t3d` | `sh tools/sync_t3d.sh` |

## 10. 저장 데이터
| localStorage 키 | 내용 | 위치 |
|---|---|---|
| `pm-save-v1` | `{coins, level(동물), best{레벨: 별}, owned[], worn{slot: id}, theme, levels{테마: 레벨}}` | `core/store.ts:2` |
| `pm-lang` | `'ko'`(기본) / `'en'` | `core/lang.ts:4` |
| `pm-settings-v1` | `{volume, music, sfx}` (music·sfx는 항상 켜짐으로 덮어씀) | `core/audio.ts:20` |
| `phonics_api_key` | phonics-api 키(교사가 입력, 값은 문서에 적지 않음) | `vendor/phonics-api.js` |

- 저장은 기기 하나에 하나뿐이다. `resetSave()`가 있지만 부르는 UI가 없다(`store.ts:25`).

## 11. QA
| 스크립트 | 검사 내용 | 통과 기준 |
|---|---|---|
| `npx tsc --noEmit -p .` + 빌드 | 타입·빌드 | 오류 0 |
| `tools/qa/shot.py <base> <prefix> 1600 900 title,game,pop` | 화면 캡처 + 실제 이동 | 로그에 `heard <word>: ok` |
| `tools/qa/layout_check.py` | 4개 창(1192×608, 1600×900, iPad 1180×820, 1600×600)에서 배치·간격·클릭 | `field_vs_FIELD` [0,0], 버튼 클릭 통과 |
| `tools/qa/word_check.ts` | 공식 녹음으로 단어·첫소리 반복 판정 | 각 단어가 자기 자신에게만 통과 |
| `tools/qa/noword_check.ts` | 단어가 아닌 소리(거꾸로 말, 튜터 대사, 음악, 기침) | 재튜닝 뒤 기준 5.2%, 음악·잡음 0 |
| `tools/qa/say_api.py [api\|device]` | 가짜 마이크로 말하기 차례 5가지(단어·아이 목소리·첫소리 반복·다른 단어·옆 사람 한국어) | 단어·반복은 통과, 다른 단어는 Almost, 옆 사람 말은 시도 아님 |
| `tools/qa/stt_set.py` · `stt_eval.ts` · `stt_grid.py` · `stt_tail.ts` · `stt_words.ts` | 인식 규칙 재튜닝(1830개 항목) | 틀린 통과 4.3%/시도, 맞는 읽기 87% |
| `tools/qa/title_orbit.py` · `sprite_edges.py` | 타이틀 글자 겹침 / 잘린 스프라이트 | 40px 미만 쌍 0 / 잘림 0 |
| `tools/qa/lipsync.py` · `cue_lag.py` · `clock_check.py` | 립싱크 시간 맞춤 | 지연 0 근처 |
| `tools/qa/voice_check.ts` · `ko_check.py` · `mix.py` | 음성 다시 듣기 / 레벨별 보드 구성 | 단어로 들림 |

## 12. 알려진 이슈·보완 필요
- **[높음]** 쓸 수 없는 화면: 일시정지 카드(Play/Restart/Home)와 설정 카드가 HTML에 있지만(`index.html:97-119`) 여는 버튼이 없다. 게임 중에 일시정지나 다시 시작을 할 방법이 없다.
- **[높음]** 마이크를 거부하면 말하기 차례를 매번 그냥 닫고 대체 수단이 없다(`listen.ts:69,96`). Magic Block의 👍 같은 것이 없어 코인은 클리어 보상으로만 받는다.
- **[높음]** 레벨 진행에 말하기가 필요 없다. 맞추기도 그림 일치라서 파닉스 학습이 듣고 따라 말하기(선택 사항)에만 걸려 있다.
- **[중간]** 화면 글이 영어로 고정돼 있고, 언어 토글은 음성만 바꾼다. 대사 자막도 없다. 기본 언어도 한국어라 Magic Block(영어 기본)과 다르다.
- **[중간]** 레벨 선택·레벨 지도가 없다. 저장된 별이 화면에 나오지 않는다(`save.best`).
- **[중간]** 결과 화면에 그 판에서 말한 단어 목록이나 성공률이 없다. 교사용 기록도 없다.
- **[중간]** 저장이 기기 하나에 하나라서, 교실 공용 iPad에서는 아이들이 코인·레벨을 나눠 쓰게 된다. 초기화 UI도 없다.
- **[중간]** 콘텐츠가 하드코딩돼 있고 레슨팩 로더가 없다. 새 단어마다 타일 그림, 공식 음성, ALTS, 소리열이 필요하다.
- **[중간]** 아이템을 다 사면(710코인) 코인을 쓸 곳이 없어 다시 할 동기가 약해진다.
- **[낮음]** Fruit 테마는 보드가 하나뿐이다(6레벨 뒤 같은 보드를 반복).
- **[낮음]** 사물·과일 테마에서도 대사가 "Swap two animals"이고, 시연은 동물로만 나온다(`demo.ts:22`).
- **[낮음]** 스킬 문서에 남은 열린 항목
  - 첫소리 반복이 다른 단어로 통과하는 혼동 8건(ant/ax, elephant/egg 등)
  - micask 클립이 잘 안 들림(사람이 직접 들어 봐야 함)
  - engine·wagon 녹음 없음(egg·window로 대체)
- **[낮음]** 타이틀 나가기가 새 탭에서는 아무 반응이 없다.
- **[낮음]** 3D 튜터는 미리보기 전용(`?tutor=3d`)이고, 헤드폰 아이템은 3D에서만 보인다.
- **[낮음]** README가 짧아 규칙·레벨·저장 설명이 없다(스킬 문서에만 있음).
