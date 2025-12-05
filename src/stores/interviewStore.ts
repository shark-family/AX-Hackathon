import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage, InterviewSummary } from '../types/interview'
import { defaultSummary } from '../types/interview'
import { extractInterviewSummary } from '../services/llmService'

interface InterviewState {
  messages: ChatMessage[]
  summary: InterviewSummary
  isLoadingSummary: boolean
  isThinking: boolean // 타이핑 인디케이터 상태 (messages 배열과 분리)
  error: string | null
  totalQuestions: number // 총 질문 수 (외부에서 설정)
  hasFinishedInterview: boolean // 인터뷰 종료 플래그
  resumePdfUrl: string | null // 생성된 이력서 PDF URL
  resumePdfBlob: Blob | null // 생성된 이력서 PDF Blob

  addMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt' | 'pending'>) => Promise<void>
  addClosingMessage: () => void // 마지막 감사 메시지 추가
  updateSummary: () => Promise<void>
  setResumePdfUrl: (url: string | null) => void // PDF URL 설정
  setResumePdfBlob: (blob: Blob | null) => void // PDF Blob 설정
  reset: () => void
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  messages: [],
  summary: defaultSummary,
  isLoadingSummary: false,
  isThinking: false,
  error: null,
  totalQuestions: 5, // 기본값, InterviewPage에서 설정
  hasFinishedInterview: false,
  resumePdfUrl: null,
  resumePdfBlob: null,

  addMessage: async (msg) => {
    // 중복 메시지 체크: 동일한 내용의 메시지가 최근에 추가되었는지 확인
    const currentMessages = get().messages
    const isDuplicate = currentMessages.some(
      (m) => m.role === msg.role && m.content === msg.content
    )
    
    if (isDuplicate) {
      console.warn('중복 메시지 추가 방지:', msg.content)
      return
    }

    const newMessage: ChatMessage = {
      ...msg,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }

    // 메시지 추가 (user든 assistant든 동일하게 처리)
    set((state) => ({
      messages: [...state.messages, newMessage],
      error: null,
    }))

    // 사용자 메시지인 경우에만 요약 업데이트
    if (msg.role === 'user') {
      // 메시지 추가 전에 현재 사용자 메시지 수 확인
      const currentUserMessages = get().messages.filter((m) => m.role === 'user')
      const { totalQuestions } = get()
      // 새 메시지가 추가되면 userMessages.length가 totalQuestions가 됨
      const isLastAnswer = currentUserMessages.length + 1 === totalQuestions

      // 타이핑 인디케이터 표시 (messages 배열에 추가하지 않음)
      set({ isThinking: true, isLoadingSummary: true, error: null })

      // 요약 업데이트 (비동기)
      try {
        const updatedMessages = [...get().messages]
        const summary = await extractInterviewSummary(updatedMessages)
        
        // 요약 완료 후 타이핑 인디케이터 제거
        set({
          summary,
          isLoadingSummary: false,
          isThinking: false,
        })

        // 마지막 질문에 대한 답변이고 아직 종료되지 않았다면 감사 메시지 추가
        const { hasFinishedInterview } = get()
        if (isLastAnswer && !hasFinishedInterview) {
          // 인터뷰 종료 플래그 설정
          set({ hasFinishedInterview: true })
          
          // 감사 메시지 추가 (딜레이 없이 바로)
          setTimeout(() => {
            get().addClosingMessage()
          }, 300)
        }
      } catch (error) {
        console.error('요약 업데이트 실패:', error)
        set({
          isLoadingSummary: false,
          isThinking: false,
          error: error instanceof Error ? error.message : '요약 업데이트 중 오류가 발생했습니다.',
        })
      }
    }
  },

  addClosingMessage: () => {
    const closingMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: '감사합니다! 이제 우측 "다음 단계로" 버튼을 눌러서 완성된 이력서를 확인해보세요!',
      createdAt: new Date().toISOString(),
    }

    // 중복 체크
    const currentMessages = get().messages
    const hasClosing = currentMessages.some(
      (m) => m.role === 'assistant' && (m.content.includes('감사합니다') || m.content.includes('다음 단계'))
    )

    if (!hasClosing) {
      set((state) => ({
        messages: [...state.messages, closingMessage],
        hasFinishedInterview: true, // 인터뷰 종료 플래그 확실히 설정
      }))
    }
  },

  updateSummary: async () => {
    const { messages } = get()
    if (messages.length === 0) {
      set({ summary: defaultSummary })
      return
    }

    try {
      set({ isLoadingSummary: true, error: null })
      const summary = await extractInterviewSummary(messages)
      set({ summary, isLoadingSummary: false })
    } catch (error) {
      console.error('요약 업데이트 실패:', error)
      set({
        isLoadingSummary: false,
        error: error instanceof Error ? error.message : '요약 업데이트 중 오류가 발생했습니다.',
      })
    }
  },

  setResumePdfUrl: (url: string | null) => {
    set({ resumePdfUrl: url })
  },

  setResumePdfBlob: (blob: Blob | null) => {
    set({ resumePdfBlob: blob })
  },

  reset: () => {
    set({
      messages: [],
      summary: defaultSummary,
      isLoadingSummary: false,
      isThinking: false,
      error: null,
      hasFinishedInterview: false,
      resumePdfUrl: null,
      resumePdfBlob: null,
    })
  },
}))

