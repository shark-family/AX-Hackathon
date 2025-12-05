import type { InterviewSummary } from '../types/interview'
import type { ResumeData } from '../types/resume'

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

/**
 * 이력서 데이터를 PDF로 생성합니다.
 * @param resumeData 이력서 데이터
 * @returns 생성된 PDF 파일의 Blob
 */
export async function generateResumePDF(resumeData: ResumeData): Promise<Blob> {
  try {
    // api_main.py의 엔드포인트 URL (환경 변수로 설정 가능)
    const apiUrl = import.meta.env.VITE_RESUME_API_URL || 'http://0.0.0.0:8000/generate-pdf'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: resumeData,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`PDF 생성 실패: ${response.status} - ${errorText}`)
    }

    // PDF 파일을 Blob으로 변환
    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('PDF 생성 실패:', error)
    throw error
  }
}

