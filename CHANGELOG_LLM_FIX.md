# LLM 요약 시스템 개선 사항

## 변경 내용

### 1. LLM System Prompt 개선 (`src/services/llmService.ts`)

**문제점:**
- 희망 회사/직무와 이전 회사/직무를 구분하지 못함
- headline에 희망 회사/직무가 포함되어 잘못된 요약 생성

**해결책:**
- 희망 회사/직무와 이전 회사/직무를 명확히 구분하는 규칙 추가
- headline은 과거 경력(previousCompany, previousJobTitle, achievements) 중심으로 생성
- 예외: 경력이 없는 신입의 경우에만 targetCompany/targetJobTitle 사용

**주요 변경사항:**
```typescript
// 이전: headline에 희망 회사/직무 포함 가능
"headline": "삼성전자 IT 지원자" ❌

// 이후: headline은 과거 경력 중심
"headline": "신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자" ✅
```

### 2. UI 매핑 수정 (`src/components/SummaryPanel.tsx`)

**변경사항:**
- 주요경력 박스에서 `summary.headline`만 사용하도록 수정
- 이전: `summary.headline || summary.previousCompany || '아직 입력된 정보가 없습니다.'`
- 이후: `summary.headline || '아직 입력된 정보가 없습니다.'`

**매핑 규칙:**
- 기본 정보
  - 이름: `summary.name`
  - 지원회사: `summary.targetCompany` (희망 회사)
  - 지원직무: `summary.targetJobTitle` (희망 직무)
- 주요경력: `summary.headline` (과거 경력 중심 요약)
- 보유 기술: `summary.skills`
- 자격증: `summary.certificates`

### 3. 테스트 코드 추가 (`src/services/llmService.test.ts`)

**추가된 내용:**
- 예시 대화 기반 테스트 케이스
- 예상 결과 및 검증 함수
- headline에 과거 경력만 포함되는지 검증

**테스트 시나리오:**
```
입력: "저는 최예인이에요. 삼성전자에 가고 싶어요. 신한은행에서 업무를 했어요."

예상 결과:
- targetCompany: "삼성전자" ✅
- previousCompany: "신한은행" ✅
- headline: "신한은행..." (과거 경력 중심) ✅
- headline에 "삼성전자" 포함 안 됨 ✅
```

## 사용 예시

### 올바른 동작 예시

**대화:**
1. 사용자: "저는 최예인이에요. 삼성전자에 IT하고 싶어요."
2. 사용자: "신한은행에서 업무를 했어요. Zustand로 성능을 개선했어요."

**결과:**
```json
{
  "name": "최예인",
  "targetCompany": "삼성전자",
  "targetJobTitle": "IT",
  "previousCompany": "신한은행",
  "previousJobTitle": null,
  "headline": "신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자"
}
```

**UI 표시:**
- 기본 정보
  - 이름: 최예인
  - 지원회사: 삼성전자 ✅
  - 지원직무: IT ✅
- 주요경력: 신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자 ✅

## 검증 방법

테스트 파일의 `validateResult` 함수를 사용하여 결과를 검증할 수 있습니다:

```typescript
import { extractInterviewSummary } from './llmService'
import { testCaseMessages, validateResult } from './llmService.test'

const result = await extractInterviewSummary(testCaseMessages)
const validation = validateResult(result)

if (!validation.isValid) {
  console.error('검증 실패:', validation.errors)
}
```

## 주의사항

1. **LLM 응답 변동성**: LLM은 매번 약간씩 다른 응답을 생성할 수 있습니다. 테스트에서는 범위 내의 응답을 허용해야 합니다.

2. **경력이 없는 경우**: 신입 지원자의 경우 `previousCompany`가 `null`이므로, 이때는 `targetCompany/targetJobTitle`을 사용한 headline이 생성됩니다.

3. **명확하지 않은 경우**: 사용자가 모호하게 말한 경우, LLM이 잘못 해석할 수 있습니다. 이 경우 수동 수정 기능을 제공하는 것이 좋습니다.

