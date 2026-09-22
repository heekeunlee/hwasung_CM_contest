# HWASEONG SOUND LAB

화성특례시 AI CM송 공모전을 준비하는 팀을 픽셀아트 오피스로 표현한 웹앱입니다.

## 주요 기능

- 역할별 10개 캐릭터와 팀별 업무 공간
- 업무·협업·회의·휴식을 순환하는 규칙 기반 자율 행동
- 동료를 찾아가는 1:1 협업과 회의실 말풍선 요약
- 캐릭터별 현재 과제와 작업 흐름
- 전략·브리프·가사·평가·기술·음원 업무보고 아카이브
- 기존 멜로디 스케치 재생
- 데스크톱과 모바일 대응

화면의 캐릭터 행동과 대화는 프로젝트 전략을 보여주는 시뮬레이션입니다.
실제 작업 결과, 제안, 미검증 항목은 업무보고 상태로 구분합니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드는 `npm run build`, GitHub Pages 배포는 `npm run deploy`로 실행합니다.

## 프로젝트 자료

- `PRODUCTION_PLAN.md`: 전문 음악 제작 조직을 반영한 운영 전략
- `demo_notes.md`: 멜로디 스케치 구성
- `here_happy_hwaseong_demo.mp3`: 비교용 음원 시안
- `create_demo.py`: 시안 생성 스크립트

## 기술

React, Vite, CSS 픽셀아트, Lucide Icons
