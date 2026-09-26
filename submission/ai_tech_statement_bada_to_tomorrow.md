# 작품 기술서 — 〈바다에서 내일까지〉

## 1. 작품 정보

- 작품명: 바다에서 내일까지
- 공모 부문: AI CM송
- 공모 주제: 모두의 행복, 더 큰 화성
- 제작 목적: 화성의 바다와 도시의 일상, 함께 만들어가는 내일을 1분 이내의 라디오형 CM송으로 표현
- 최종 음원 길이: 53초
- 최종 영상 규격: 1920×1080, 53초, MP4
- 음원 규격: MP3 및 WAV, 48kHz, stereo

## 2. 기획 의도

관광지를 나열하는 방식 대신, 서해의 빛과 사람들이 걷는 일상 장면을 통해 화성의 매력을 전달하고자 했다. 제목의 ‘바다에서 내일까지’는 화성의 해안 정체성과 미래지향적 도시 이미지를 짧은 문장으로 연결한다. 첫 5초 안에 제목 후렴을 제시하고, 반복 가능한 짧은 멜로디와 또렷한 도시명 발음으로 라디오·SNS·행사 현장에서의 확장성을 고려했다.

## 3. 사용한 생성형 AI 도구

### 음악 생성

- 도구: Suno
- 사용 목적: 한국어 가사 기반 보컬·멜로디·편곡 생성
- 생성일: 2026-09-24
- Suno 생성 ID: `965c0b4e-8f19-4b6e-9252-6d81f832b47e`
- 사용 계정: 출품자 본인 계정
- 모델/세부 버전: Suno 내보내기 메타데이터에 별도 기록되지 않아 미기재

### 앨범아트 생성

- 도구: OpenAI Image Generation
- 사용 목적: 화성의 해안·도시·시민의 일상을 표현하는 16:9 앨범아트 배경 생성
- 생성 조건: 텍스트와 로고가 없는 배경 이미지를 생성한 후, 제목·슬로건·공식 BI는 별도 편집 단계에서 삽입

### 편집·제작

- FFmpeg: 앨범아트와 Suno 음원을 결합해 MP4 영상 제작
- Python Pillow: 제목, 슬로건, 공식 BI, 출처 표기 배치
- 사용 글꼴: Apple SD Gothic Neo
- 공식 BI: 화성특례시청 ‘화성특례시(BI)’ 페이지에서 제공하는 원본 사용

## 4. Suno 입력 내용

### Style / Song Description Prompt

```text
Original Korean radio commercial jingle,
bright sophisticated modern pop,
warm acoustic guitar, clean electric piano,
light hand claps, smooth bass, subtle uplifting brass,
mixed male and female Korean vocals,
clear natural Korean pronunciation,
memorable chorus within the first 5 seconds,
short 50-second broadcast-ready CM song,
warm coastal city atmosphere,
West Sea morning light, optimistic urban lifestyle,
emotional but not sentimental,
modern and premium advertising sound,
strong sing-along chorus,
112 BPM, C major,
original melody and chord progression,
no imitation of existing songs, artists, brands or commercials,
avoid childish nursery-rhyme style,
avoid traditional festival song style,
avoid exaggerated shouting
```

### Custom Lyrics

```text
[Intro]
바다에서 내일까지
화성

[Verse]
서해빛이 번진 아침
사람들이 길을 열어
익숙했던 오늘 위에
새로운 장면이 피어나

[Pre-Chorus]
너의 하루와 나의 하루
한곳에서 이어져

[Chorus]
바다에서 내일까지
하루하루 이어지는 곳
함께 걷는 모든 순간
더 크게 열리는 화성

[Tag]
바다에서 내일까지
화성특례시
```

## 5. 제작 과정

1. 공모 주제와 CM송 심사 기준을 검토했다.
2. 관광지 이름을 나열하지 않고 바다·시민의 일상·미래를 연결하는 콘셉트를 정했다.
3. ‘바다에서 내일까지’를 제목 및 핵심 후렴으로 선정했다.
4. Suno Custom Mode에 스타일 프롬프트와 가사를 입력해 여러 시안을 생성했다.
5. 53초 길이의 결과물을 선정하고 MP3/WAV 원본을 보관했다.
6. OpenAI Image Generation으로 앨범아트 배경을 생성했다.
7. 화성특례시 공식 BI와 공모 주제 슬로건을 이미지에 배치했다.
8. FFmpeg로 1920×1080 앨범아트 영상과 음원을 결합했다.
9. 최종 파일의 길이, 해상도, 코덱, 음원 채널을 확인했다.

## 6. 출품 파일

- `public/바다에서 내일까지 화성_album_video.mp4`
- `public/hwaseong-cm-album-video.mp4`
- `바다에서 내일까지 화성 (1).mp3`
- `바다에서 내일까지 화성.wav`
- `submission/lyrics_bada_to_tomorrow.txt`

## 7. 출처 및 권리 기록

- 음악: Suno 생성 결과물. 원본 생성 ID와 생성일을 기록했다.
- 이미지: OpenAI Image Generation으로 새롭게 생성한 앨범아트 배경.
- 도시 BI: 화성특례시청 공식 ‘화성특례시(BI)’ 제공 원본. 영상 하단에 출처 표기.
- 글꼴: Apple SD Gothic Neo 시스템 글꼴.
- 외부 사진·영상·샘플·기존 음원을 사용하지 않았다.

## 8. 검토 및 유의사항

제목·가사·콘셉트는 공개 검색으로 선행 문구를 확인했으나, 검색 결과만으로 멜로디의 비유사성이나 법적 비표절을 보증할 수는 없다. Suno 생성 결과의 사용 범위와 상업적 이용 조건은 출품자 계정의 Suno 약관 및 공모전 운영 기준을 최종 확인한다. 요청 시 Suno 입력 프롬프트와 생성 이력을 제출할 수 있도록 원본 자료를 보관한다.
