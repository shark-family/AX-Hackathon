import OpenAI from 'openai'
import type { ChatMessage, InterviewSummary } from '../types/interview'
import type { ResumeData } from '../types/resume'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.error('VITE_OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.')
}

const openai = new OpenAI({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true, // 브라우저에서 사용하는 경우
})

const SYSTEM_PROMPT = `당신은 한국어 인터뷰 대화에서 지원자 정보를 추출하는 전문 어시스턴트입니다.

**역할:**
- interviewer(메일이)와 candidate(사용자)의 대화가 섞여 들어옵니다.
- 사용자(candidate)의 발화 내용만 기준으로 정보를 추출합니다.
- 이름, 회사, 직무, 자격증, 성과 등을 최대한 찾아서 채웁니다.

**중요: 희망 회사/직무와 이전 회사/직무를 반드시 구분하세요**

**1. 희망 회사/직무 (targetCompany/targetJobTitle) 추출 규칙:**
다음과 같은 표현이 나오면 "앞으로 가고 싶은 회사/직무"로 인식하고 targetCompany/targetJobTitle에 매핑하세요:
- "가고 싶다", "지원하고 싶다", "지원 회사", "희망 회사", "지원 직무", "하고 싶다", "하고 싶어요", "지원하고 싶어요"
- "삼성전자에 가고 싶어요", "IT하고 싶네요" → targetCompany: "삼성전자", targetJobTitle: "IT"

**2. 이전 회사/직무 (previousCompany/previousJobTitle) 추출 규칙:**
다음과 같은 표현이 나오면 "과거에 실제로 일했던 회사/직무"로 인식하고 previousCompany/previousJobTitle에 매핑하세요:
- "예전에", "이전에는", "전에", "과거에", "에서 일했다", "업무를 했다", "근무했다", "일했어요"
- "신한은행에서 업무를 했어요" → previousCompany: "신한은행"

**3. headline 생성 규칙 (매우 중요):**
- headline은 **과거 경력(previousCompany, previousJobTitle, achievements)을 기준**으로 "어떤 경험을 가진 인재인지"를 한 줄로 요약하는 문장으로 생성하세요.
- headline에는 **희망 회사(targetCompany)나 희망 직무(targetJobTitle)를 포함하지 마세요**.
- 예시:
  - ✅ 올바른 예: "신한은행 예금담보대출 시스템 마이그레이션을 수행한 백엔드 개발자"
  - ✅ 올바른 예: "신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자"
  - ❌ 잘못된 예: "삼성전자 IT 지원자" (희망 회사가 들어감)
  - ❌ 잘못된 예: "삼성전자 백엔드 개발자" (희망 직무가 들어감)
- **중요 규칙**: previousCompany/previousJobTitle 정보가 전혀 없으면 headline을 빈 문자열("")로 두세요. 
  - 경력이 없는 신입의 경우 headline을 생성하지 않습니다.
  - headline은 반드시 과거 경력이 있을 때만 생성합니다.

**추출할 정보:**
- name: 지원자의 이름
- targetCompany: 지원하고자 하는 회사명 (앞으로 가고 싶은 회사)
- targetJobTitle: 지원하고자 하는 직무명 (앞으로 하고 싶은 직무)
- previousCompany: 이전에 근무했던 회사명 (과거에 실제로 일했던 회사)
- previousJobTitle: 이전 직무명 (과거에 실제로 했던 직무)
- skills: 보유 기술/스택 배열 (예: ["C++", "SQL", "Zustand"])
- certificates: 자격증 배열 (예: ["정보처리기사", "SQLD"])
- achievements: 성과/업적 배열 (예: ["시스템 성능 30% 개선", "예금담보대출 마이그레이션 완료"])
- headline: 과거 경력 중심 한 줄 요약 (previousCompany, previousJobTitle, achievements 기반)

**예시 1: 희망과 이전 경력이 모두 있는 경우**
대화: "저는 최예인이에요. 삼성전자에 가고 싶어요. 직무는 IT하고 싶네요. 신한은행에서 업무를 했어요. Zustand를 사용해서 실행속도를 높였어요."
{
  "name": "최예인",
  "targetCompany": "삼성전자",
  "targetJobTitle": "IT",
  "previousCompany": "신한은행",
  "previousJobTitle": null,
  "skills": ["Zustand"],
  "certificates": [],
  "achievements": ["Zustand를 사용한 시스템 성능 개선"],
  "headline": "신한은행에서 Zustand를 활용한 시스템 성능 개선 경험이 있는 개발자"
}

**예시 2: 경력이 없는 신입의 경우**
대화: "저는 최예인이에요. 삼성전자에 백엔드 개발자로 지원하고 싶어요."
{
  "name": "최예인",
  "targetCompany": "삼성전자",
  "targetJobTitle": "백엔드 개발자",
  "previousCompany": null,
  "previousJobTitle": null,
  "skills": [],
  "certificates": [],
  "achievements": [],
  "headline": ""
}

이제 대화 내용을 분석하여 JSON만 반환하세요. 반드시 희망 회사/직무와 이전 회사/직무를 구분하고, headline은 과거 경력 중심으로 생성하세요.`

/**
 * 채팅 메시지 배열을 받아서 구조화된 인터뷰 요약 JSON을 반환합니다.
 */
export async function extractInterviewSummary(
  messages: ChatMessage[]
): Promise<InterviewSummary> {
  try {
    // 대화 내용을 프롬프트로 변환
    const conversationText = messages
      .map((msg) => {
        const roleLabel = msg.role === 'assistant' ? '메일이' : '지원자'
        return `${roleLabel}: ${msg.content}`
      })
      .join('\n')

    const userPrompt = `다음은 인터뷰 대화 내용입니다. 지원자의 정보를 추출하여 JSON 형식으로 반환하세요.\n\n${conversationText}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('LLM 응답이 비어있습니다.')
    }

    // JSON 파싱
    let parsed: InterviewSummary
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError)
      console.error('원본 응답:', content)
      throw new Error('LLM 응답을 JSON으로 파싱할 수 없습니다.')
    }

    // 타입 검증 및 기본값 보정
    const result: InterviewSummary = {
      name: parsed.name ?? null,
      targetCompany: parsed.targetCompany ?? null,
      targetJobTitle: parsed.targetJobTitle ?? null,
      previousCompany: parsed.previousCompany ?? null,
      previousJobTitle: parsed.previousJobTitle ?? null,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      headline: parsed.headline ?? '',
    }

    // headline 검증: 이전 회사/직무 정보가 없으면 headline을 빈 문자열로 강제
    if (!result.previousCompany && !result.previousJobTitle) {
      result.headline = ''
    }

    return result
  } catch (error) {
    console.error('LLM 호출 중 에러 발생:', error)
    throw error
  }
}

const RESUME_SYSTEM_PROMPT = `당신은 인터뷰 내용을 바탕으로 이력서용 JSON 데이터를 생성하는 전문 어시스턴트입니다.

**역할:**
- 인터뷰 대화 내용에서 지원자의 정보를 추출하여 이력서 JSON 형식으로 변환합니다.
- 인터뷰에서 알 수 없는 정보는 제공된 기본값을 사용합니다.
- 경력, 학력, 자격증 정보를 구조화된 형식으로 변환합니다.

**출력 형식:**
다음 JSON 구조를 따라야 합니다:
{
  "name": "이름",
  "birthdate": "생년월일 (예: 1966년 3월 24일)",
  "address": "주소",
  "photo_path": "senior_photo.png",
  "phone": "전화번호",
  "email": "이메일",
  "emergency_contact": "비상연락처 (관계 포함)",
  "education": [
    {
      "institution": "학교명",
      "degree": "전공 (선택사항)",
      "period": "기간 (예: 1982.03 -- 1985.02)"
    }
  ],
  "experience": [
    {
      "company": "회사명",
      "role": "직책/역할",
      "period": "기간 (예: 1991.03 -- 2001.02)",
      "location": "근무지역"
    }
  ],
  "certifications": [
    {
      "title": "자격증명",
      "issuer": "발급기관 (선택사항)",
      "score": "점수 (선택사항, 예: 650점)",
      "date": "취득일 (예: 2023.12)"
    }
  ]
}

**규칙:**
1. 인터뷰에서 추출할 수 있는 정보만 사용하고, 없는 정보는 기본값을 사용합니다.
2. 경력(experience):
   - previousCompany와 previousJobTitle이 있으면 이를 기반으로 experience 배열을 생성합니다.
   - 경력이 없으면 빈 배열 []로 둡니다.
   - period는 인터뷰에서 언급된 기간을 사용하고, 없으면 적절히 추정합니다 (예: "1991.03 -- 2001.02").
   - location은 인터뷰에서 언급된 지역을 사용하고, 없으면 "서울 지역" 또는 "서울 본사" 등으로 설정합니다.
   - role은 previousJobTitle을 사용하고, 없으면 인터뷰 내용에서 추론합니다.
3. 자격증(certifications):
   - certificates 배열에 있는 자격증명을 기반으로 생성합니다.
   - 자격증이 없으면 빈 배열 []로 둡니다.
   - date는 인터뷰에서 언급된 취득일을 사용하고, 없으면 적절히 추정합니다 (예: "2023.12").
   - issuer는 자격증명에서 추론 가능한 경우에만 포함합니다 (예: "정보처리기사" → "한국산업인력공단").
4. 학력(education):
   - 인터뷰에서 언급된 경우에만 포함하고, 없으면 빈 배열 []로 둡니다.
   - period 형식은 "YYYY.MM -- YYYY.MM" 형식을 따릅니다.
5. 날짜 형식:
   - 기간: "YYYY.MM -- YYYY.MM" (예: "1991.03 -- 2001.02")
   - 단일 날짜: "YYYY.MM" (예: "2023.12")
6. 모든 필수 필드(name, birthdate, address 등)는 반드시 채워야 하며, 기본값이 제공됩니다.`

/**
 * 인터뷰 내용과 요약을 바탕으로 이력서용 JSON 데이터를 생성합니다.
 */
export async function generateResumeData(
  messages: ChatMessage[],
  summary: InterviewSummary,
  defaultData: Partial<ResumeData>
): Promise<ResumeData> {
  try {
    // 대화 내용을 프롬프트로 변환
    const conversationText = messages
      .map((msg) => {
        const roleLabel = msg.role === 'assistant' ? '메일이' : '지원자'
        return `${roleLabel}: ${msg.content}`
      })
      .join('\n')

    const userPrompt = `다음은 인터뷰 대화 내용과 추출된 요약 정보입니다.

**인터뷰 대화:**
${conversationText}

**추출된 요약 정보:**
- 이름: ${summary.name || '알 수 없음'}
- 이전 회사: ${summary.previousCompany || '없음'}
- 이전 직무: ${summary.previousJobTitle || '없음'}
- 기술: ${summary.skills.join(', ') || '없음'}
- 자격증: ${summary.certificates.join(', ') || '없음'}
- 성과: ${summary.achievements.join(', ') || '없음'}

**기본값 (인터뷰에서 알 수 없는 정보):**
${JSON.stringify(defaultData, null, 2)}

위 정보를 바탕으로 이력서 JSON을 생성하세요. 인터뷰에서 알 수 없는 정보는 기본값을 사용하세요.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: RESUME_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('LLM 응답이 비어있습니다.')
    }

    // JSON 파싱
    let parsed: Partial<ResumeData>
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.error('JSON 파싱 실패:', parseError)
      console.error('원본 응답:', content)
      throw new Error('LLM 응답을 JSON으로 파싱할 수 없습니다.')
    }

    // 기본값과 병합하여 완전한 ResumeData 생성
    const result: ResumeData = {
      name: parsed.name || defaultData.name || '지원자',
      birthdate: parsed.birthdate || defaultData.birthdate || '',
      address: parsed.address || defaultData.address || '',
      photo_path: parsed.photo_path || defaultData.photo_path || 'senior_photo.png',
      phone: parsed.phone || defaultData.phone || '',
      email: parsed.email || defaultData.email || '',
      emergency_contact: parsed.emergency_contact || defaultData.emergency_contact || '',
      education: Array.isArray(parsed.education) ? parsed.education : (defaultData.education || []),
      experience: Array.isArray(parsed.experience) ? parsed.experience : (defaultData.experience || []),
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : (defaultData.certifications || []),
    }

    // 경력이 없는 경우 빈 배열로 설정
    if (!summary.previousCompany && !summary.previousJobTitle) {
      result.experience = []
    }

    // 자격증이 없는 경우 빈 배열로 설정
    if (!summary.certificates || summary.certificates.length === 0) {
      result.certifications = []
    }

    return result
  } catch (error) {
    console.error('이력서 데이터 생성 중 에러 발생:', error)
    throw error
  }
}

