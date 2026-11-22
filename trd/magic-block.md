---
id: magic-block
title: Magic Block
title_ko: 매직 블록
tagline: 친구와 번갈아 m 블럭을 빼고 그 단어를 소리 내어 읽는 3D 젠가
players: 2인
skill: 첫글자 m 단어 고르기(함정 jam·lemon 구별) + 튜터를 따라 단어 말하기
scope: FPR K U1 Mm · 직접 고른 m 단어 46개(함정 jam·lemon 포함), 그림·음성은 레슨팩
stack: Vite + TypeScript + three.js + cannon-es (기기 안 인식 transformers.js whisper-tiny.en)
repo: https://github.com/jinilee-hue/Magic-Block
url: https://jinilee-hue.github.io/Magic-Block/
updated: 2026-11-22
---

# Magic Block TRD

## 1. 개요
- **목적**: FPR K Unit 1의 m단어로 첫글자 m 찾기와 소리 내어 읽기를 2인 대전 젠가로 연습한다.
- **대상 연령**: 5~7세(유치원). README는 "FPR K · 5세"라고 적고 있다.
- **학습 목표**
  - 탑에 쓰인 단어 중 m으로 시작하는 블럭을 고른다. 안에 m이 든 함정 단어 jam·lemon을 구별해야 한다.
  - 블럭을 빼면 여우가 "Now say the word."와 함께 단어를 먼저 읽어 주고, 아이가 따라 읽는다. 혼자 해독하는 읽기가 아니라 따라 말하기다.
- **플레이 인원**: 2인 고정이며 한 기기에서 번갈아 한다. 1인 모드는 없다.
- **한 판 시간**: 6~10분(추정). m블럭 14개마다 읽기 차례가 있고, 잘못 고른 횟수에 따라 달라진다.

## 2. 게임 흐름
1. (선택) 인트로 영상: `public/intro.mp4`가 있을 때만 재생된다. 현재는 파일이 없어 바로 타이틀로 간다.
2. 타이틀: 11층 탑 위에 로고와 START가 있다. 첫 터치에 배경음악과 여우 인사가 나온다.
3. 캐릭터 고르기: P1이 동물 4종(토끼·고양이·강아지·판다) 중 하나를 고르고, 이어서 P2가 고른다. 'Ready?'가 나오면 다시 고르기 또는 시작을 누른다.
4. 게임 안내: 첫 판은 규칙 전체, 다음 판부터는 짧게 안내한다(`game.ts:176-195`).
5. 한 차례(핵심 루프)
   1. 여우가 "Player N, your turn!"이라고 말하고, 블럭을 고를 때까지 말풍선이 남아 있다.
   2. 탑을 드래그로 돌려 보고 블럭을 탭한다.
   3. **m블럭을 고른 경우**: 블럭이 빠져 떠오른 뒤 그림 카드로 회전한다. 여우가 단어를 읽고 마이크가 열린다. 판정에 통과하거나 실제 시도가 3번 통과하지 못하면("Good try!") 블럭을 얻는다. 블럭은 플레이어 카드로 날아가고 차례가 넘어간다.
   4. **m이 아닌 블럭을 고른 경우**: 블럭이 흔들리기만 하고, 여우가 "Uh-oh! jam — It starts with /j/ /j/"라고 말한다. ✕가 하나 붙고 차례가 넘어간다. ✕가 2개가 되면 경고 대사가 나온다.
6. 종료 조건
   - m블럭을 다 빼면 탑이 와르르 무너지고, 블럭을 더 많이 모은 사람이 이긴다(동점 있음).
   - 한 사람의 ✕가 3개가 되면 탑이 넘어지고 그 사람이 진다.
7. 결과(펼친 책): Play Again 또는 Home을 고른다.

## 3. 콘텐츠·데이터
| 구분 | 내용 | 개수 | 출처 |
|---|---|---|---|
| m단어 | man map mat match meat milk mirror mitt mitten monkey moon mop mouse mouth mug mushroom my mail mailbox mask | 20 | `tools/build_words.py`의 `M_WORDS`(하드코딩). FPR K Unit 1 장부(SAD·FPR 단어 연구 자료집)와 대조해 검증한다. |
| 다른 단어 | pan van fan cap tap cat hat bat hop pop rug tail turkey spoon sit pie tie box sun dog sock six ten bag jam lemon | 26 | `OTHER`(하드코딩). jam·lemon은 매 판 들어가는 함정 단어다. |
| 그림 카드 | m단어 중 mailbox를 뺀 19개 | 19 | 18개는 레슨팩 FP.K.U1L1 그림이다. mitten만 Phonics Island의 FPR K 그림이다. |
| 단어 음성 | m단어, /m/ 낱소리 | 137 클립(튜터 대사 포함) | 레슨팩 FP.K.U1L1의 공식 음성(m단어 18 + ten). 팩에 없는 단어는 phonics-api TTS, 다른 첫소리는 FPR K 공식 녹음이다. |

- 데이터 파일
  - `src/data/words.json`: `target: 'm'`, 단어마다 `w`, `m`, `first`, `ko`, `pages`, `lessons`, `rivals`(라임 단어)
  - `cards.json`, `voice.json`, `mouth.json`
  - `phonemes.json`: 판정용 기대 소리열
- 한 판 구성: 30블럭 = m단어 14 + jam·lemon + 다른 단어 14. m단어는 기기별 덱(`pj.mdeck.v1`) 순서대로 다음 14개를 쓰므로, 두 판을 하면 20개가 모두 나온다(`game.ts:115-135`).
- **다른 레슨 추가**: 레슨팩 manifest를 읽는 로더가 없다. 목표 글자 m은 다음 세 곳에 고정돼 있다.
  - `words.json`의 `target`
  - 단어의 `m` 플래그
  - 튜터 대사(`build_voice.py`의 rule "Find a block that starts with m!", look, allout)

  따라서 다음 순서로 다시 만들어야 한다.
  1. `build_words.py`의 단어 목록을 교체한다.
  2. `build_voice.py`로 대사와 음성을 다시 만든다.
  3. `import_cards.py`로 카드를 가져온다.
  4. `build_phonemes.py`로 기대 소리열을 만든다.
  5. `build_mouth_cues.py`로 입 모양을 만든다.

## 4. 레벨·난이도
- 레벨이 없는 단일 모드다. 탑은 10층×3 = 30블럭이고 블럭 두께는 0.75다(`tower.ts:15-20`). `?layers=`와 `?bh=`는 테스트용 파라미터다.
- 판마다 바뀌는 것은 m단어 14개의 조합과 블럭 배치뿐이다.
- 차례 타이머는 없다. 정해진 시간은 다음과 같다.
  - 듣기 창: 소리 시작을 8초 기다리고, 최대 4.5초 동안 듣고, 끝 무음 0.8초에서 멈춘다(`game.ts:373`).
  - 유휴 힌트: 7초 뒤 회전 화살표, 16초 뒤 m블럭 노란 고리가 나온다(`game.ts:26-28`).
- 적응형 난이도와 레벨 선택은 없다.
- 실수 규칙: 한 사람이 3번 틀리면 진다(`MAX_STRIKES`, `game.ts:32`).

## 5. 보상·피드백
| 보상 | 조건 | 용도 |
|---|---|---|
| 블럭(1점) | 올바른 읽기, 또는 실제 시도 3번 실패("Good try!") | 승패 판정. 두 경우 모두 같은 1점이다(`game.ts:282-283`). |
| ✕ | m이 아닌 블럭을 고름 | 3개가 되면 탑이 넘어지고 패배 |

- **축하 연출**
  - 블럭을 뺄 때 금빛 별
  - 카드가 나올 때 사탕 줄기·도는 별·반짝이(`game/cheer.ts`)
  - 읽기 성공 시 confetti와 여우 환호
  - 결과 화면의 confetti 대포와 승자 왕관
- **결과 화면**(`hud.ts:204-226`)
  - 플레이어별 동물, 'Player N', 블럭 수, ✕ 표시
  - 모은 단어를 실제 블럭 모양으로 그린 그림(`ui/blockshot.ts`, 탭하면 다시 들려줌)
  - Play Again / Home 버튼
- 쓰거나 모으는 경제 요소는 없다. 판이 끝나면 공통 기록(`phonics.progress`)에 읽은 단어·못 읽은 단어·승자·시간을 남긴다(2026-11-22).

## 6. 튜터·음성·발음 판정
- **튜터**: 여우. 사용자 시트 `jenga_tutor.png`에서 4포즈(teach·read·jump·great)를 잘라 썼다.
  - 움직임: WebGL 메시와 뼈대(`ui/fox.ts`)로 숨쉬기·귀·꼬리를 움직이고, 위아래로 뛰지는 않는다.
  - 립싱크: Rhubarb 입모양 시간표(`data/mouth.json`)를 쓴다.
  - 말풍선: `ui/foxsay.ts`가 대사를 한 문장씩 보여 준다.
- **튜터 음성**: 대사 영어 39줄과 한국어 39줄. `voice.json` 기준 엔진은 `phonics-api`, 목소리는 `en-US-AvaMultilingualNeural`이다. 예전 'aiden' 높이·빠르기로 보정했다(EN 높이 ×1.109, 속도 ×1.035 / KO ×1.030, ×1.169). README:64는 아직 Qwen3-TTS 'aiden'이라고 적혀 있어 실제와 다르다.
- **배경음악**: `tools/make_bgm.py`로 만든 128 BPM, 30초 루프다. 아이가 읽는 동안은 꺼진다.
- **발음 판정 순서**
  1. 기기에 키가 있으면 phonics-api `/v1/speech/analyze`(사내 Wav2Vec2, 녹음은 저장하지 않음)로 보낸다. 판정은 `PhonicsAPI.judge`가 들은 소리열을 단어 및 라임 단어(b로 시작하는 것은 제외)와 비교한다(`core/apiCheck.ts`).
  2. 키가 없거나 오프라인·혼잡·6초 초과면 기기 안의 whisper-tiny.en(transformers.js, 웹워커)이 판정한다. 방식은 자유 받아쓰기와 강제 디코딩 점수 비교이고, 기준값은 RULE gap 8 / rgap 2 / minT −10 / maxNo 0.5다(`core/sttCheck.ts`).
- **규칙**
  - 무음은 통과하지 않는다.
  - 실제로 읽은 시도가 3번 통과하지 못하면 블럭을 준다.
  - `echoCancellation`은 끈다. 여우가 말하는 동안은 듣지 않는다.
- **키 관리**: 타이틀 왼쪽 위 열쇠 버튼(`PhonicsAPI.keyDialog`)으로 교사가 기기마다 한 번 입력한다. 코드와 repo에는 넣지 않는다. 점 색은 초록 = 서버, 회색 = 기기 안 판정이다. `?debug`를 붙이면 시도별 결과가 화면에 표시된다.

## 7. 화면·UI 요구사항
- **기준 단위**: 16:9 `--u = min(1vh, .5625vw)`, 4:3 이하 `--u = min(.82vh, .75vw)`(`style.css:470-473`). 가로·세로 모두 지원한다.
- **상단 바**: Toy-Catch 기준으로 버튼 7.6tu이고, 4:3보다 넓은 화면에 적용된다.
  - 오른쪽: EN|한 토글(타이틀만) · 소리 버튼(누르면 세로 볼륨 막대) · 나가기
  - 왼쪽: 열쇠 버튼(타이틀만)
- **나가기**: 타이틀에서는 `history.back`, 안 되면 `window.close`, 그래도 안 되면 새로고침한다. 게임·결과 화면에서는 한 번 탭하면 타이틀로 간다(`corner.ts:49-57`).
- **언어**: 타이틀에서만 바꿀 수 있고 기본은 영어다. 여우 음성·말풍선·화면 글(`data-i18n`)이 바뀌고, 단어 소리는 영어 그대로다. 한글 글꼴은 Jua 서브셋이다.
- **터치 크기**
  - 코너 버튼 7.8u: 1024×768에서 약 44px(CSS 계산)
  - 마이크 16u, 다시 듣기 11u
  - 3D 블럭의 탭 크기는 측정하지 않았다.
- **조작**: 하단 가운데 원위치 버튼 하나. 드래그로 회전·기울이기, 두 손가락 또는 휠로 확대한다.
- **예외 상태**
  - 마이크 거부·미지원·권한 창 15초 무응답: 판정을 못 하므로 블럭 없이 넘어간다. "I said it" 버튼은 JUMP와 겹쳐 없앴다(2026-11-22).
  - 오프라인·키 없음: whisper가 판정한다. 모델 55MB가 `public/stt`에 들어 있다.
  - whisper 로딩 중·오류: 목소리만 들려도 통과한다(`game.ts:400,402`).

## 8. 기술 구성
- **스택**: Vite 7, TypeScript 5.9, three 0.186(탑·조명·그림자), cannon-es 0.20(붕괴 물리), @huggingface/transformers 4.3(whisper)

| 파일 | 역할 |
|---|---|
| `src/main.ts` | 부팅, 화면 전환, 첫 터치 소리, 테스트 훅 `window.__pj` |
| `src/game/game.ts` | 차례·판정·실수·종료 흐름, 단어 덱 |
| `src/game/tower.ts` · `stage.ts` · `collapse.ts` | 탑 생성·블럭 아틀라스 / 카메라·조명·배경 / 붕괴 물리 |
| `src/game/cheer.ts` · `hintring.ts` · `spinhint.ts` | 정답 연출 / 힌트 고리 / 회전 안내 |
| `src/ui/hud.ts` · `picker.ts` · `title.ts` · `corner.ts` | 플레이어 카드·그림 카드·결과 / 캐릭터 고르기 / 타이틀 / 상단 바 |
| `src/ui/fox.ts` · `foxsay.ts` | 여우 리그·립싱크 / 말풍선 |
| `src/core/mic.ts` · `stt.ts` · `sttWorker.ts` · `sttCheck.ts` · `apiCheck.ts` | 마이크·VAD / whisper 워커 / 판정 규칙 / phonics-api |
| `src/core/audio.ts` · `speech.ts` · `lang.ts` | 음악·효과음·볼륨 / 대사 재생 / 언어 |
| `src/vendor/phonics-api.js` | phonics-kit 복사본(키 창·analyze·judge) |

- **실행**: `npm install` 후 `npm run dev`(포트 5195 strictPort, `vite.config.ts`).
- **빌드**: `npm run build`(`tsc --noEmit && vite build`, base `./`).
- **배포**: main에 push하면 `.github/workflows/deploy.yml`(Node 22, `npm ci`, build)이 GitHub Pages에 올린다. `public/` 파일은 10분 캐시된다.
- **테스트 URL**: `?nointro` `?seed=` `?fake=1` `?nopick` `?m=map,mug` `?bh=` `?layers=` `?debug`

## 9. 에셋·생성 파이프라인
| 스크립트 | 산출물 | 실행 |
|---|---|---|
| `tools/build_words.py` | 단어 목록·rivals → `src/data/words.json` | `python3 tools/build_words.py` |
| `tools/build_phonemes.py` | 기대 소리열(서버 G2P) → `phonemes.json` | `python3 tools/build_phonemes.py` |
| `tools/build_voice.py` | 튜터·단어 음성 → `public/voice/`, `voice.json`(끝에 `pack_voice.py` 실행) | `uv run --with numpy python tools/build_voice.py` |
| `tools/pack_voice.py` | 레슨팩 단어 음성·/m/로 덮어쓰기 | 단독 실행 가능 |
| `tools/build_mouth_cues.py` | Rhubarb 입모양 → `mouth.json` | 음성 변경 뒤 |
| `tools/import_cards.py` · `fit_cards.py` | 그림 카드 → `public/cards/`, `cards.json` | `uv run --with pillow --with numpy python tools/import_cards.py` |
| `tools/build_tutor*.py` · `tutor_eyes.py` | 여우 포즈·가중치·눈꺼풀·입 자리 → `public/fox/` | 그림 변경 시 |
| `tools/make_animals.py` · `make_key_btn.py` | 동물 배지 · 열쇠 버튼 webp | 그림 변경 시 |
| `tools/make_ko_font.py` | Jua 서브셋 → `public/fonts/Jua-ko.woff2` | 한국어 글 변경 시 |
| `tools/make_bgm.py` | 배경음악 → `public/bgm.mp3` | |
| `tools/find_sparkles.py` | 배경 반짝이 위치 → `sparkles.json` | 배경 변경 시 |
| `tools/word_sources.py` | 단어 출처 표 → `docs/word_sources.xlsx`(내부용, git 제외) | |

## 10. 저장 데이터
| localStorage 키 | 내용 | 위치 |
|---|---|---|
| `pj.mdeck.v1` | 아직 안 나온 m단어 순서(JSON 배열) | `game.ts:34` |
| `pj.lang.v1` | `'en'` / `'ko'` | `core/lang.ts:8` |
| `pj-settings-v1` | `{volume, music, sfx}` | `core/audio.ts:17` |
| `phonics_api_key` | phonics-api 키(교사가 입력, 값은 문서에 적지 않음) | `vendor/phonics-api.js` |

- 판 결과는 공통 기록에 남긴다(2026-11-22). 기기 단위 저장이라 아이별 프로필은 없다.

## 11. QA
| 스크립트 | 검사 내용 | 통과 기준 |
|---|---|---|
| `npx tsc --noEmit -p .` + `npm run build` | 타입·빌드 | 오류 0 |
| `tools/qa/boot.py` | 헤드리스로 열어 콘솔 오류·멈춘 곳 확인 | 콘솔 오류 없음 |
| `tools/qa/sizes.py` | 6개 크기(1280×800, 1024×768, 1180×820, 1920×1080, 1366×1024, 820×1180)에서 HUD·말풍선·여우·버튼 겹침 | 겹침 없음 |
| `tools/qa/shot.py` · `sheet.py` · `thick.py` | 화면 캡처·비교 시트 | 눈으로 확인 |
| `tools/qa/flow.py ending` / `stt` | 마지막 블럭→붕괴→결과 / 실제 whisper에 틀린 단어→맞는 단어 | 결과 화면 도달 / 틀린 단어 거절·맞는 단어 통과 |
| `tools/qa/readflow.py [api\|device]` | 실제 게임에서 음성 클립으로 읽기 차례 진행 | 맞는 단어 통과 |
| `tools/qa/stt_set.py` · `stt_eval.ts` · `stt_grid.py` · `stt_rules.py` | 인식 규칙 튜닝(28단어 × 7목소리 × 4방) | `sttCheck.ts` 기준 정답 89%, 첫소리만 다른 단어 11~13%, 음악 0% |
| `tools/qa/voice_check.ts` · `ko_check.py` | 음성 파일을 다시 들어 단어 확인 / 한국어 글 넘침 | 단어로 들림 / 넘침 없음 |
| 스킬 `scripts/qa_strikes.py` · `qa_collapse_mc.py` | ✕3 흐름 / 붕괴 반복 실험 | 세 번째 실수에 탑이 넘어짐 |

- 배포 뒤에는 라이브 URL에서 바뀐 부분을 다시 확인한다(스킬 Finish 절차).

## 12. 알려진 이슈·보완 필요
- [반영] 설명 SKIP(2026-11-22): 첫 판 설명 음성 동안 아래 가운데 흰 반투명 SKIP.
- [반영] 말하기 JUMP(2026-11-22): 마이크 오른쪽 초록 JUMP, 누르면 블럭은 아무도 안 가짐. 첫 조용한 차례에 손 안내 + "넘어가고 싶으면 점프 버튼을 눌러!".
- [반영] 무음 무한 반복 해결(2026-11-22): 한 번 다시 읽어 주고 약 20초 뒤 블럭 없이 넘어간다. 틀림 2번이면 "Good try!" 후 블럭 없음.
- **[높음]** whisper가 로딩 중이거나 오류이면 목소리만 들려도 통과한다(`game.ts:400,402`). Phonics Match는 이 경우 통과시키지 않으므로 게임 간 기준도 다르다.
- **[중간]** 3번 실패한 "Good try!" 블럭과 정답 블럭이 같은 1점이다(`game.ts:282-283`). 발음 노력이 점수에 반영되지 않는다.
- **[중간]** 1인 모드가 없어 혼자서는 할 수 없다.
- **[중간]** 레벨·난이도 단계·진행 기록이 없다. 교사가 볼 결과도 없어 다시 할 동기가 약하다.
- **[중간]** 목표 글자 m이 데이터·대사·코드에 고정돼 있고 레슨팩 로더가 없다. 다른 레슨으로 넓히는 비용이 크다.
- **[중간]** 마이크가 없을 때는 👍 자가 확인뿐이라 누구나 눌러 통과할 수 있다.
- **[낮음]** 끝면에 첫글자만 크게 써 있어서, 소리가 아니라 모양으로 m을 찾을 수 있다(학습 설계 검토 필요).
- **[낮음]** README가 실제와 다르다.
  - 언어 토글이 게임 화면에 있다고 적혀 있다(README:27, 34). 실제로는 타이틀에만 있다.
  - 나가기를 두 번 탭해야 한다고 적혀 있다(README:28). 실제로는 한 번이다.
  - TTS를 Qwen3-TTS aiden이라고 적고 있다(README:64). 실제로는 Ava Multilingual이다.
- **[낮음]** mailbox 그림 카드가 없다. mitten 카드는 공통 대표이미지로 아직 바꾸지 않았다.
- **[낮음]** 인트로 영상과 동물별 에셋은 아직 없다(README:33, 35).
- **[낮음]** 3D 블럭(특히 끝면)의 실제 탭 크기를 측정하지 않았다. 5세 손가락 기준으로 확인이 필요하다.
