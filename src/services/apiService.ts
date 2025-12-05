import type { InterviewSummary } from '../types/interview'

/**
 * 인터뷰 요약 데이터를 백엔드에 전송합니다.
 */
export async function submitInterviewSummary(summary: InterviewSummary): Promise<void> {
  try {
    const response = await fetch('/api/interview/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(summary),
    })

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`)
    }

    const result = await response.json()
    console.log('요약 데이터 전송 성공:', result)
  } catch (error) {
    console.error('요약 데이터 전송 실패:', error)
    throw error
  }
}

