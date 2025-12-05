/**
 * LLM 서비스 테스트 예시
 * 
 * 실제 LLM을 호출하지 않고, 예상되는 동작을 문서화한 테스트 스토리입니다.
 * 실제 테스트를 실행하려면 vitest 등을 사용하여 통합 테스트를 작성하세요.
 */

import type { ChatMessage } from '../types/interview'

/**
 * 테스트 케이스: 희망 회사/직무와 이전 회사/직무 구분
 */
export const testCaseMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: '먼저 성함과 지원을 희망하시는 회사 및 직무를 말씀해주시겠어요?',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: '안녕하세요 저는 최예인이에요. 저는 삼성전자에 가고 싶어요. 직무는 IT하고 싶네요.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content: '이전에는 어떤 회사에서 업무를 하셨나요? 또, 어떤 성과를 내셨나요?',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    role: 'user',
    content: '저는 신한은행에서 업무를 했어요. 저는 Zustand를 사용해서 실행속도를 높였어요.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    role: 'assistant',
    content: '어떤 기술을 가장 잘 활용하시나요?',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    role: 'user',
    content: '저는 C++, SQL을 잘해요. 자격증은 SQLD, 정보처리기사가 있어요.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    role: 'assistant',
    content: '앞으로 어떤 일을 하고 싶으신가요?',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    role: 'user',
    content: '저는 시스템 관리를 하고 싶어요.',
    createdAt: new Date().toISOString(),
  },
]

/**
 * 예상되는 결과
 */
export const expectedResult = {
  name: '최예인',
  targetCompany: '삼성전자', // 희망 회사
  targetJobTitle: 'IT', // 희망 직무
  previousCompany: '신한은행', // 이전 회사
  previousJobTitle: null, // 이전 직무 (명시되지 않음)
  skills: ['C++', 'SQL', 'Zustand'],
  certificates: ['SQLD', '정보처리기사'],
  achievements: ['Zustand를 사용한 시스템 성능 개선'],
  headline: '신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자', // 과거 경력 중심
}

/**
 * 검증 함수
 * 
 * 실제 테스트에서는 다음과 같이 사용:
 * 
 * ```typescript
 * import { extractInterviewSummary } from './llmService'
 * import { testCaseMessages, expectedResult } from './llmService.test'
 * 
 * const result = await extractInterviewSummary(testCaseMessages)
 * 
 * // 검증
 * expect(result.targetCompany).toBe(expectedResult.targetCompany)
 * expect(result.previousCompany).toBe(expectedResult.previousCompany)
 * expect(result.headline).toContain('신한은행')
 * expect(result.headline).not.toContain('삼성전자')
 * ```
 */
export function validateResult(result: typeof expectedResult) {
  const errors: string[] = []

  // 기본 검증
  if (result.targetCompany !== '삼성전자') {
    errors.push(`targetCompany가 "삼성전자"가 아님: ${result.targetCompany}`)
  }

  if (result.previousCompany !== '신한은행') {
    errors.push(`previousCompany가 "신한은행"이 아님: ${result.previousCompany}`)
  }

  // headline 검증: 과거 경력 중심이어야 함
  if (!result.headline.includes('신한은행')) {
    errors.push(`headline에 "신한은행"이 포함되지 않음: ${result.headline}`)
  }

  if (result.headline.includes('삼성전자')) {
    errors.push(`headline에 희망 회사 "삼성전자"가 포함되어 있음: ${result.headline}`)
  }

  // skills 검증
  const expectedSkills = ['C++', 'SQL', 'Zustand']
  const missingSkills = expectedSkills.filter((skill) => !result.skills.includes(skill))
  if (missingSkills.length > 0) {
    errors.push(`누락된 기술: ${missingSkills.join(', ')}`)
  }

  // certificates 검증
  const expectedCerts = ['SQLD', '정보처리기사']
  const missingCerts = expectedCerts.filter((cert) => !result.certificates.includes(cert))
  if (missingCerts.length > 0) {
    errors.push(`누락된 자격증: ${missingCerts.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

