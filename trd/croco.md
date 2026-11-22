---
id: croco
title: Croco Phonics
title_ko: 크로코 파닉스
tagline: 악어 이빨을 번갈아 누르고, 튀어나온 그림 단어를 따라 말해요
players: 2인
skill: 레벨 음가 + 단어 듣기 → 단어 따라 말하기(phonics-api 판정), FPR K Lesson 1–10
scope: FPR K Lesson 1–10 · 레벨 1 = 레슨팩 FP.K.U1L1 m단어 18개, 레벨 2–10 = 교재 Lesson 단어
stack: Vanilla JS + three.js r186(IIFE, 빌드 없음)
repo: https://github.com/jinilee-hue/Croco-Phonics
url: https://jinilee-hue.github.io/Croco-Phonics/
updated: 2026-11-22
---

# Croco Phonics TRD

## 1. 개요
- 목적: "악어 이빨" 장난감 규칙에 파닉스를 얹은 2인 보드게임. 안전한 이빨을 누를 때마다 그림카드가 나오고, 아이가 그 단어를 소리 내어 말해야 차례가 넘어간다.
- 대상: 5~7세 한국 유치원생. 콘텐츠·화면 글자는 영어, 튜터 대사(음성·말풍선)만 EN/한 선택.
- 학습 목표: 레벨(=교재 Lesson) 음가와 단어 듣기, 공개된 단어 따라 말하기. 이빨을 고르는 행동 자체에는 파닉스 판단이 없다(이빨 10개에 같은 글자).
- 플레이 인원: 2인(한 기기 번갈아). 1인·학급 모드 없음.
- 한 판 시간: 약 1~2분(추정 — 함정 위치가 무작위라 평균 5.5번 누름, 안전 이빨 한 번에 10초 안팎으로 계산, 실측 아님). 함정이 첫 이빨이면(10%) 말하기 없이 끝난다. 튜터 설명은 별도, 매 방문 자동 재생(Skip 가능).

## 2. 게임 흐름
1. 로딩 → 타이틀 등장(로고 낙하, 악어가 돌며 커짐, 그림카드, 레벨 글자 10개가 악어 둘레를 돎, START).
2. 약 3.8초 뒤 악어 튜터 설명(`runTutorial`, `js/game.js:936`, tut1–tut8). START 대신 Skip. 끝나거나 Skip → 타이틀 + "Press start to play!".
3. START → 카메라가 올라가 이빨 10개가 보이는 게임 화면, BGM이 긴장감 있는 게임 루프로 바뀜.
4. 라운드 시작(`startRound`, `:386`): 지시(함정) 단어 카드가 크게 나와 규칙 대사 + 음가 + 단어 → 경고 덥석 → 화면 위로 이동.
5. 차례(`setTurn`, `:448`): 그 플레이어 아바타 위에 "Your turn!" 말풍선. 5.2초 무입력 → 장갑 손이 빈 이빨을 톡톡(`:468`).
6. 안전 이빨(`safe`, `:508`): 카드가 튀어나와 누른 사람 쪽으로 → 음가 + 단어 → "Now say the word." → 듣기·판정(`sayIt`, `:577`) → 칭찬 → 카드 더미로 → 상대 차례.
7. 함정 이빨(`chomp`, `:646`): 이빨 보라색 + 경고음 → 덥석 → 입에서 큰 카드 → 걸린 단어 음가 + 단어 한 번 더 → 결과.
8. 결과(`showResult`, `:696`): 다시 하기(같은 레벨, 진 사람 먼저) / 다음 레벨(`levelUp`, `:1166` — 입 닫고 이빨 글자 교체, "Level N!" 배너, 새 음가).
9. 나가기: 게임·결과 → 타이틀, 타이틀 → 이전 페이지(뒤로 가기 → 창 닫기 → 새로고침 순, `:1208-1215`).

## 3. 콘텐츠·데이터
| 레벨 | 레슨 | 단어 수 |
|---|---|---|
| 1 | L1 Mm | 18 (mail, man, map, mask, mat, match, meat, mice, milk, mirror, mitt, monkey, moon, mop, mouse, mouth, mug, mushroom) |
| 2–10 | L2 Short a · L3 Ss · L4 Tt · L5 Pp · L6 Nn · L7 Short i · L8 Cc · L9 Ff · L10 Dd | 8 · 9 · 8 · 7 · 6 · 6 · 7 · 10 · 8 |

- 데이터 파일: `js/words.js`(`window.CROCO_WORDS = {levels, notYet, words}`) — `tools/build_words.py`가 생성. 직접 편집하지 않는다.
- 출처: SAD·FPR 단어 연구 자료집 `~/dev/sadfpr-studio/data/b2_book_FPRK.json`의 레슨 쪽 단어 중 그 레슨 소리를 가진 것. 공식 그림카드와 음성이 둘 다 있는 단어만 쓰고 기능어는 뺀다.
- 레슨팩 `FP.K.U1L1`은 레벨 1의 단어 목록·음성·카드 그림에 쓴다. 레벨 1 = 레슨팩 m단어 18개(`tools/build_words.py` assert).
- 판 구성: 이빨 10개에 함정 단어 1개, 나머지는 그 레벨 다른 단어(부족하면 다시 섞어 채움, `game.js:400-412`).
- 판정용 기대 소리열: `js/phonemes.js`(`tools/build_phonemes.py`, 서버 G2P).
- 다른 레슨 추가: 그림카드와 음성이 생기면 `build_words.py` → `build_voice.py`를 다시 실행하면 레벨이 자동으로 늘어난다. L11 이후는 플레이 가능한 단어가 4개 미만이라 막혀 있다(`notYet`, 예: Hh 1단어, Ll 0단어).

## 4. 레벨·난이도
- 레벨 10개(Lesson 1–10). 레벨마다 바뀌는 것은 음가·단어·이빨 글자뿐이고, 규칙과 난이도는 같다.
- 타이머 없음. 적응형 난이도 없음.
- 말하기 판정: 틀린 시도 3번이면 넘어간다. 조용하거나 '먼 소리'면 시도로 치지 않고 다시 부른다(`:584-601`).
- 레벨 선택: 결과 화면의 다음 레벨 버튼, 또는 URL `?level=N`(`:1137`). 게임 안 레벨 선택 UI는 없다. 마지막 레벨에서는 다음 레벨 버튼이 없다.

## 5. 보상·피드백
| 보상 | 획득 | 용도 | 저장 |
|---|---|---|---|
| 그림카드 | 안전 이빨 + 말하기 | 플레이어 더미에 쌓임(개수 배지). 승패와 무관 | 안 됨(판마다 비움) |
| 레벨별 승리 칩 | 상대가 함정을 누르면 +1 | 이름표 옆 표시(글자·왕관·승수, `renderWins` `:213`) | 안 됨(새로고침하면 0) |

- 결과 화면: 입체 리본 "Player N Wins!"(언어별로 미리 구운 이미지), 왕관 쓴 승자 아바타, 승리 칩 +1 팝, 다시 하기 · 다음 레벨.
- 연출: 안전 이빨 반짝이·별, 칭찬 대사(great2/great3), 덥석 때 화면 흔들림·보라 폭발, 결과 팡파르·색종이 비. 판이 진행될수록 BGM이 최대 7% 빨라지고 절반부터 심장 박동이 들어간다. 음악 볼륨은 0.25(2026-11-22, 0.1에서 올림 — 게임 중 가장 작았음, 들리는 크기 약 -32.6 LUFS).

## 6. 튜터·음성·발음 판정
- 튜터: 3D 악어(`js/croc.js`, SDF 클레이 모델). 말풍선 + 음성, 표정(안전 ^^ / 함정 놀람), 콧김·발가락 움직임. 2026-11-20 "기존 튜터 유지" 결정에 해당한다.
- 튜터 음성: `tools/build_voice.py` 기본 엔진 phonics-api TTS — Azure en-US-AvaMultilingualNeural을 예전 'aiden' 목소리에 맞춰 음높이·빠르기 조정(EN ×1.109/×1.035, KO ×1.030/×1.169). 예전 회사 TTS는 `--engine qwen`.
- 단어 음성: 레슨팩(L1 18단어 + ten, doll) → Magic Block → Phonics Island 순. 없던 9단어(sip, toy, paint 등)는 TTS. 음가는 공식 FPR K 녹음.
- 발음 판정(`judgeWord`, `:564`):

| 조건 | 동작 |
|---|---|
| 기기에 phonics-api 키 있음 + 서버 사용 가능 | 들은 소리를 16 kHz WAV로 `/v1/speech/analyze` 전송 → `PhonicsAPI.judge`로 그 레벨의 다른 단어와 비교. ok → 통과, 틀림·가까움 → "Try again! Listen." + 다시 들려줌(시도 1회), 먼 소리 → 다시 들려줌(시도 아님) |
| 키 없음 / 오프라인 / 서버 바쁨 | 약 0.15초 이상 이어진 소리면 통과(`Mic.listen`, `js/audio.js:295`). 녹음은 기기 밖으로 나가지 않는다 |
| 마이크 없음·거부·허용 대기 | 아이가 말한 뒤 마이크 버튼을 눌러야 넘어감(`tapMic`, `:616`), 9초마다 다시 부름 |

- 서버 호출 제한 시간 6초, 오류·503 뒤 15초 쉼(`js/phonics-api.js:21-23, 122`). 기기 안 음성 인식은 없다. `?debug`이면 판정 결과를 화면에 표시한다.
- API 키 값은 문서·저장소에 적지 않는다.

## 7. 화면·UI 요구사항
- 기준: 화면 비율에 맞춰 크기를 조정한다(`--u = min(1vh, .62vw)`, 세로 화면은 `.95vw`). 16:9, 4:3(1024×768), 세로(820×1180)를 QA한다. 4:3·세로에서는 배경을 1.12~1.3배 확대한다(`fitRoom`).
- 상단 바: 왼쪽 로고(게임 중 "Level N · 제목" 표시), 가운데 지시 단어 카드(움직이는 덥석 배지 + 다시 듣기), 오른쪽 EN|한 · 소리 · 나가기. 타이틀 왼쪽 위에 phonics-api 키 버튼(`index.html:83`, 게임 중 숨김).
- 언어 토글: 타이틀에만 있고, 처음엔 한국어. 튜터 음성과 말풍선만 바뀌고 화면 글자는 두 언어 모두 영어(파닉스 공통 규칙).
- 버튼 크기: 상단 버튼은 UI 표준(7.6tu, 가장자리 3tu, 가로 화면) — 1024×768에서 44 px, 가장자리 17 px(Toy-Catch와 같은 자리). 이빨은 3D 레이캐스트로 고르고, 이빨 뒤에 더 큰 투명 판정 영역이 있다(`js/stage.js:114`).
- 하단 양쪽 구석: 플레이어 아바타 + 카드 더미 + 승리 칩. 결과 버튼은 세로 화면에서 위아래로 쌓인다.
- 예외 상태: 마이크 거부 → 탭 진행. 오프라인 → 소리 감지만. 첫 터치 전 소리 잠김 → 말풍선만 띄우고, 첫 터치에 지금 줄부터 소리 낸다.

## 8. 기술 구성
- 스택: Vanilla HTML/CSS/JS, 빌드 없음. three.js r186 IIFE(`vendor/three.iife.js`). 글꼴 Baloo 2(`css/font.css`에 데이터 URL), Jua 부분 글꼴(`css/font-ko.css`). `file://`로 열어도 동작한다(음성·글꼴 내장).

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 마크업(타이틀·게임·결과·상단 바) |
| `js/game.js` | 진행·턴·말하기·결과·레벨·튜터 설명·EN/한 |
| `js/croc.js` | 3D 악어(SDF 클레이, 턱·이빨·눈·표정, AO 굽기) |
| `js/sdf.js` · `js/stage.js` | SDF + Surface Nets 메셔 / 카메라·조명·그림자·피킹 |
| `js/audio.js` | 음성·효과음·BGM·긴장도, 마이크(`Mic.listen`) |
| `js/phonics-api.js` | phonics-kit에서 복사(키 대화상자, analyze, judge, `?debug`) — kit에서 고친 뒤 다시 복사 |
| `js/fx.js` | 반짝이·별·색종이·보라 폭발 |
| `js/words.js` · `js/phonemes.js` | 생성물: 레벨 단어 / 기대 소리열 |
| `js/voice.js` · `voice-data.js` · `bgm-data.js` · `bgm-game-data.js` | 생성물: 음성 목록·base64 음성·BGM |
| `js/card-boxes.js` · `js/rb-text.js` | 생성물: 카드 그림 영역 / 결과 리본 글자 |
| `dev/croc.html` | 악어 모델 확인용 |

- 실행: `실행.command` 더블클릭 → `tools/serve.py 5211`(no-cache 서버) → http://127.0.0.1:5211/. 또는 `index.html` 직접 열기.
- 배포: 공개 저장소, GitHub Pages(main `/` 레거시 빌드, `.nojekyll`). push가 곧 배포(약 30초). push 전에 경로 대소문자와 TTS 환경값 노출을 점검한다(스킬 규칙).

## 9. 에셋·생성 파이프라인
| 에셋 | 스크립트 | 실행 |
|---|---|---|
| 레벨 단어 | `tools/build_words.py` | `uv run --with pillow --with numpy python tools/build_words.py` |
| 카드 그림 | `tools/rep_cards.py` → `tools/card_boxes.py` | `uv run --with pillow --with numpy python tools/rep_cards.py` |
| 기대 소리열 | `tools/build_phonemes.py` | `python3 tools/build_phonemes.py` |
| 음성 | `tools/build_voice.py` | `uv run --with numpy python tools/build_voice.py`(예전 목소리 `--engine qwen`) |
| 타이틀 BGM / 게임 BGM | `tools/make_bgm.py`(2026-11-22 정글 그루브 D 126 BPM) / `tools/make_bgm_game.py`(A단조 150 BPM) | `uv run --with numpy … python tools/make_bgm*.py` |
| 로고·배경 | `tools/import_art.py` | `uv run --with pillow python tools/import_art.py --bg <파일> / --logo <파일>`(다운로드 폴더에서 이름으로만) |
| 덥석 배지 · 결과 리본 글자 · 도는 글자 · 아바타 | `make_bite_badge.py` · `make_banner_text.py` · `make_orbit_letters.py` · `crop_avatars.py` | 악어 얼굴·문구·색을 바꾼 뒤 다시 실행 |
| 글꼴 | `tools/embed_font.py` · `tools/make_ko_font.py` | 한국어 문구를 바꾼 뒤 다시 실행 |

## 10. 저장 데이터
| 키 | 저장소 | 내용 |
|---|---|---|
| `croco.lang.v1` | localStorage | 언어 `en`/`ko` |
| `croco-muted` | localStorage | 음소거 `1`/`0` |
| `phonics_api_key` | localStorage | 기기별 phonics-api 키(값은 문서·저장소에 적지 않음) |
| `croco.howto.v1` | localStorage | 예전 "설명 1회" 표시 — 지금은 시작할 때 지운다(`game.js:837`) |

- 공통 기록(`phonics.progress`)에 도달 레벨과 판 결과를 남기고, 다시 열면 저장된 레벨로 이어진다(2026-11-22). 레벨별 승리 칩·모은 카드는 저장 안 됨.

## 11. QA
- headless Playwright + 실제 Chrome(Metal). 사용자 브라우저는 쓰지 않는다. `window.__ready && window.__intro`를 기다린 뒤 START. 훅: `window.__test`, `window.__croco`. 이 문서를 쓰면서는 실행하지 않았다.

| 스크립트 | 검사 내용 / 통과 기준 |
|---|---|
| `tools/qa/qa_flow.py` | 실제 클릭으로 한 판 → 결과 화면 도달 |
| `tools/qa/qa_sizes.py` | 1024×768 · 1180×820 · 1920×1080 · 820×1180, 마이크 없음 탭, 대기 손 |
| `tools/qa/qa_sayit.py [--real]` | 말하기 전엔 안 넘어감(조용함 ×3 → 목소리, 마이크 없음 11초 → 탭). `--real`: 방 소음·딸깍은 14초 동안 통과 안 함, 실제 단어는 통과 |
| `tools/qa/qa_say_api.py [api\|device]` | phonics-api 판정: 맞음·다른 단어·옆 사람 말·3번 시도 |
| `tools/qa/qa_levels.py` | 레벨마다 음성·카드·이빨 글자, 다음 레벨·다시 하기·마지막 레벨 |
| `tools/qa/qa_wins.py` | 덥석 뒤 다시 읽기 순서, 승리 칩 개수, 3사이즈에서 겹침 없음 |
| `tools/qa/qa_tutor.py` · `qa_tutor_voice.py` | 설명 → 타이틀 → 게임, Skip, EN/한, 말풍선 글자와 음성 일치 |
| `qa_again` · `qa_file` · `qa_cards` · `qa_intro_letters` · `qa_turn` · `console` | 다시 하기·홈, `file://`, 카드 비행, 도는 글자, 말풍선 꼬리, SDF 경고 |
| 배포 후 | 카드·음성 파일 전부 200, 콘솔 오류·실패 요청 없음, 한 판 진행 |

## 12. 알려진 이슈·보완 필요
- [반영] 말하기 JUMP(2026-11-22): 카드 윗모서리 초록 JUMP, 누르면 카드는 아무도 안 가짐. 첫 조용한 차례에 장갑·음성 안내.
- [반영] 무한 반복 해결(2026-11-22): 틀림 2번 → "Good try!", 침묵은 한 번 다시 읽고 약 20초 뒤 카드 없이 넘어간다.
- [높음] 이빨 고르기에 파닉스 판단이 없고(이빨 10개에 같은 글자) 승패는 순전히 운이다. 잘 말해도 승패·보상에 반영되지 않는다.
- [중간] 그림카드를 모아도 쓸 곳이 없고 승패와도 무관하다.
- [반영] 진도·레벨(2026-11-22): 타이틀 START 옆 레벨 칩 → 1–10 글자 타일 판(도달 레벨+1까지, 나머지 잠금), 새로고침해도 이어 하기. 승리 기록은 아직 저장 안 됨.
- [반영] 판정 불가 규칙(2026-11-22): 키 없음·서버 실패·마이크 없음이면 카드 없이 넘어간다(아무 소리 통과 삭제). 기기 안 인식기는 없어 키가 없으면 카드를 못 얻는다. 공통 판정에 모음·첫소리 규칙.
- [중간] 함정이 첫 이빨이면(10%) 말하기 0회로 판이 끝난다.
- [중간] 1인 모드·학급 모드가 없다. 마이크 하나를 같이 써서 누가 말했는지 구분하지 못한다.
- [낮음] Lesson 11 이후 레벨이 없다(그림카드·음성 부족).
- [반영] 상단 버튼 = UI 표준(1024×768 44 px, 1920×1080 82 px).
- [반영] 레벨 1 = 레슨팩 m단어 18개(2026-11-22).
- [낮음] 튜터 설명이 매 방문 자동 재생된다(Skip 가능). 반복 플레이 때 시작이 늦다.
- [낮음] 문서가 코드와 어긋난다: README BGM 설명(F장조 132 BPM)과 `make_bgm_game.py` 주석이 2026-11-22 정글 그루브로 바뀐 타이틀 곡을 반영하지 못했다. README 음성 절은 회사 TTS 'aiden' 기준이지만 지금 기본 엔진은 phonics-api(Ava)다.
