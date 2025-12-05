# LLM 기반 인터뷰 요약 시스템

## 개요

이 프로젝트는 React + TypeScript + Zustand로 구현된 인터뷰 챗봇 UI에 LLM(OpenAI GPT-4o-mini)을 통합하여 채팅 메시지를 구조화된 인터뷰 요약 JSON으로 변환하는 시스템입니다.

## 구조

### 타입 정의 (`src/types/interview.ts`)

- `ChatMessage`: 채팅 메시지 타입
- `InterviewSummary`: LLM이 추출한 구조화된 인터뷰 요약 데이터
- `defaultSummary`: 기본값

### LLM 서비스 (`src/services/llmService.ts`)

- `extractInterviewSummary`: 채팅 메시지 배열을 받아서 구조화된 요약 JSON을 반환
- OpenAI Chat Completions API 사용
- System prompt로 한국어 인터뷰 대화에서 정보 추출

### Zustand Store (`src/stores/interviewStore.ts`)

- `useInterviewStore`: 인터뷰 상태 관리
- `addMessage`: 메시지 추가 시 자동으로 LLM 호출하여 요약 업데이트
- `updateSummary`: 수동으로 요약 업데이트
- `reset`: 상태 초기화

### 컴포넌트

- `SummaryPanel`: 실시간 요약 정보 표시 컴포넌트
- `InterviewPage`: 메인 인터뷰 페이지 (Zustand store 통합)

## 사용 방법

### 1. 메시지 추가

```typescript
import { useInterviewStore } from '../stores/interviewStore'

const { addMessage } = useInterviewStore()

// 사용자 메시지 추가
await addMessage({
  role: 'user',
  content: '안녕하세요, 저는 최예인입니다. 삼성전자에 백엔드 개발자로 지원하고 싶어요.',
})

// LLM이 자동으로 요약을 업데이트합니다
```

### 2. 요약 정보 읽기

```typescript
import { useInterviewStore } from '../stores/interviewStore'

const { summary, isLoadingSummary } = useInterviewStore()

console.log(summary.name) // "최예인"
console.log(summary.targetCompany) // "삼성전자"
console.log(summary.targetJobTitle) // "백엔드 개발자"
```

### 3. 백엔드에 전송

```typescript
import { submitInterviewSummary } from '../services/apiService'
import { useInterviewStore } from '../stores/interviewStore'

const { summary } = useInterviewStore()

// "다음 단계로" 버튼 클릭 시
await submitInterviewSummary(summary)
```

## 환경 변수

OpenAI API 키는 현재 코드에 하드코딩되어 있습니다. 프로덕션 환경에서는 환경 변수로 관리하세요:

```typescript
// .env.local
VITE_OPENAI_API_KEY=your_api_key_here

// llmService.ts
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})
```

## 에러 처리

- LLM 응답 파싱 실패 시: 기존 `summary` 유지
- 네트워크 에러 시: 콘솔에 로깅, UI에 에러 메시지 표시
- JSON 파싱 실패 시: `defaultSummary`로 롤백

## 주의사항

1. **API 키 보안**: 현재 브라우저에서 직접 OpenAI API를 호출하고 있습니다. 프로덕션에서는 백엔드 프록시를 통해 호출하는 것을 권장합니다.

2. **비용 관리**: LLM 호출은 비용이 발생합니다. 메시지마다 호출하지 않고, 일정 간격으로 배치 처리하는 것을 고려하세요.

3. **성능**: LLM 호출은 비동기이므로 로딩 상태를 적절히 표시해야 합니다.

## 향후 개선 사항

- [ ] 백엔드 프록시를 통한 API 호출
- [ ] 요약 업데이트 배치 처리 (디바운싱)
- [ ] 캐싱 메커니즘 추가
- [ ] 에러 재시도 로직
- [ ] 요약 히스토리 관리

