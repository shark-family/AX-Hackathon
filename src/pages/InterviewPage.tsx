import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ChatBubble from "../components/ChatBubble.tsx"
import Header from "../components/Header.tsx"
import SummaryPanel from "../components/SummaryPanel.tsx"
import { useInterviewStore } from "../stores/interviewStore.ts"
import { generateResumeData } from "../services/llmService.ts"
import { generateResumePDF } from "../services/apiService.ts"
import type { ResumeData } from "../types/resume.ts"

const MicIcon = ({ className, color = "#8c9099" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
    <path d="M12 18v3" />
    <path d="M9 21h6" />
  </svg>
)

const SendIcon = ({ className, color = "#ffffff" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M4 4 20 12 4 20l3-8-3-8Z" />
  </svg>
)

export default function InterviewPage() {
  const navigate = useNavigate()
  const { messages, addMessage, isLoadingSummary, isThinking, summary, hasFinishedInterview } = useInterviewStore()
  const steps = ["기본 정보", "경력 사항", "개인의 강점", "희망 직무", "최종 확인"]
  const [inputValue, setInputValue] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)
  const questionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitialMessage = useRef(false)
  const isSendingRef = useRef(false)

  // Store에 총 질문 수 설정
  useEffect(() => {
    useInterviewStore.setState({ totalQuestions: steps.length })
  }, [steps.length])

  // 사용자 메시지 수에 따라 currentStep 계산
  const userMessages = messages.filter((m) => m.role === "user")
  const currentStep = Math.min(userMessages.length, steps.length - 1)
  const progressPercent = ((currentStep + 1) / steps.length) * 100

  const getPromptForStep = (step: number) => {
    const name = summary.name || displayName || "지원자님"
    if (step === 0)
      return "안녕하세요! 인터뷰를 시작하겠습니다. 먼저 성함과 지원을 원하시는 회사 및 직무를 말씀해주시겠어요?"
    if (step === 1) return "이전에는 어떤 회사에서 업무를 하셨나요? 또, 어떤 성과를 내셨나요?"
    if (step === 2)
      return `${name}님은 어떤 기술을 가장 잘 활용하시나요? 또는 어떤 부분에서 강점을 갖고 계신가요? 관련 수상이나 자격증도 어필해주세요!`
    if (step === 3) {
      // 희망 직무 질문: 첫 번째 답변에서 말한 희망 회사/직무를 기준으로 질문 생성
      const targetCompany = summary.targetCompany
      const targetJobTitle = summary.targetJobTitle
      const questionText = targetCompany && targetJobTitle
        ? `${targetCompany} ${targetJobTitle}`
        : targetCompany || targetJobTitle || name
      return `${questionText}에서 무슨 일을 하고 싶으세요? 구체적으로 말씀해주시면 보다 구체적인 피드백이 가능합니다!`
    }
    return ""
  }

  // 초기 메시지 추가 (한 번만)
  useEffect(() => {
    if (!hasInitialMessage.current) {
      const assistantMessages = messages.filter((m) => m.role === "assistant")
      if (assistantMessages.length === 0 && messages.length === 0) {
        hasInitialMessage.current = true
        addMessage({
          role: "assistant",
          content: getPromptForStep(0),
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 요약 완료 후 다음 질문 생성
  useEffect(() => {
    // 인터뷰가 종료되었으면 더 이상 질문 생성하지 않음
    if (hasFinishedInterview) {
      return
    }

    // 기존 타이머 정리
    if (questionTimeoutRef.current) {
      clearTimeout(questionTimeoutRef.current)
      questionTimeoutRef.current = null
    }

    const assistantMessages = messages.filter((m) => m.role === "assistant")
    
    // 조건: 요약 완료, 타이핑 중이 아님, 사용자 답변이 있고, 다음 질문이 아직 없음
    if (
      !isLoadingSummary &&
      !isThinking &&
      userMessages.length > 0 &&
      userMessages.length < steps.length &&
      assistantMessages.length <= userMessages.length // 질문 수가 답변 수와 같거나 작아야 함
    ) {
      const nextStep = userMessages.length
      const nextPrompt = getPromptForStep(nextStep)
      
      if (nextPrompt) {
        // 약간의 딜레이를 두어 자연스러운 흐름 생성
        questionTimeoutRef.current = setTimeout(() => {
          addMessage({
            role: "assistant",
            content: nextPrompt,
          })
          questionTimeoutRef.current = null
        }, 500)
      }
    }

    // Cleanup 함수
    return () => {
      if (questionTimeoutRef.current) {
        clearTimeout(questionTimeoutRef.current)
      }
    }
  }, [isLoadingSummary, isThinking, messages, userMessages.length, summary, steps.length, addMessage, hasFinishedInterview])


  const handleSend = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoadingSummary || isThinking || isSendingRef.current) return

    // 중복 전송 방지
    isSendingRef.current = true

    try {
      // 이름 추출 (간단한 파싱, LLM이 더 정확하게 추출함)
      const nameMatch = trimmed.match(/(?:이름은|이름이|제\s*이름은|저는|저)\s*([가-힣]{2,4})/)
      if (nameMatch?.[1] && !displayName) {
        setDisplayName(nameMatch[1])
      }

      // 입력창 비우기 (Optimistic UI)
      setInputValue("")

      // Zustand store에 사용자 메시지 추가 (한 번만)
      // addMessage 내부에서 isThinking 상태가 true로 설정되고 요약이 시작됨
      await addMessage({
        role: "user",
        content: trimmed,
      })
    } finally {
      isSendingRef.current = false
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header />

        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-[#ff9330]">내일로</span>
              <span className="text-sm font-medium text-gray-400">X</span>
              <span className="text-lg font-semibold text-[#ff9330]">MK</span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} / {steps.length}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#ffb066] to-[#ff9330] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-5 text-center text-xs font-medium text-gray-500">
              {steps.map((label, idx) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1 transition ${
                    idx === currentStep ? "text-[#ff9330]" : idx < currentStep ? "text-gray-600" : ""
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${idx <= currentStep ? "bg-[#ff9330]" : "bg-gray-300"}`}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[2fr_0.95fr] gap-5">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  sender={msg.role === "assistant" ? "interviewer" : "candidate"}
                  name={msg.role === "assistant" ? "매일이" : displayName || "지원자"}
                  message={msg.content}
                />
              ))}
              {/* 타이핑 인디케이터는 messages 배열과 분리하여 별도로 렌더링 */}
              {isThinking && (
                <ChatBubble
                  sender="interviewer"
                  name="매일이"
                  message=""
                  pending={true}
                />
              )}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                className="flex-1 border-none text-sm outline-none placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="답변을 입력하세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoadingSummary || isThinking}
                onKeyDown={(e) => {
                  const nativeEvent = e.nativeEvent as KeyboardEvent
                  if (nativeEvent.isComposing) return
                  if (e.key === "Enter" && !isLoadingSummary && !isThinking) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300">
                <MicIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={isLoadingSummary || isThinking || !inputValue.trim()}
                className="flex items-center gap-2 rounded-full bg-[#ff9330] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d] disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ boxShadow: "0 8px 24px rgba(255,147,48,0.28)" }}
              >
                <SendIcon className="h-4 w-4" />
                전송
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <SummaryPanel />
            <button
              onClick={async () => {
                if (isGeneratingResume) return
                
                setIsGeneratingResume(true)
                try {
                  const currentSummary = useInterviewStore.getState().summary
                  const currentMessages = useInterviewStore.getState().messages
                  
                  // 기본값 설정 (하드코딩)
                  const defaultResumeData: Partial<ResumeData> = {
                    name: currentSummary.name || "지원자",
                    birthdate: "1966년 3월 24일",
                    address: "서울특별시 중구 퇴계로 190 (필동1가)",
                    photo_path: "senior_photo.png",
                    phone: "010-2000-2000",
                    email: "sciver@mk.co.kr",
                    emergency_contact: "(관계: 배우자) 010-2000-2114",
                    education: [],
                    experience: [],
                    certifications: [],
                  }
                  
                  // 인터뷰 내용을 이력서 JSON으로 변환
                  console.log("이력서 데이터 생성 중...")
                  const resumeData = await generateResumeData(
                    currentMessages,
                    currentSummary,
                    defaultResumeData
                  )
                  
                  console.log("생성된 이력서 데이터:", resumeData)
                  
                  // PDF 생성
                  console.log("PDF 생성 중...")
                  const pdfBlob = await generateResumePDF(resumeData)
                  
                  // Blob을 URL로 변환하여 저장
                  const pdfUrl = URL.createObjectURL(pdfBlob)
                  useInterviewStore.getState().setResumePdfUrl(pdfUrl)
                  useInterviewStore.getState().setResumePdfBlob(pdfBlob)
                  
                  console.log("PDF 생성 완료!")
                  
                  // ResumePage로 이동
                  navigate("/resume")
                } catch (error) {
                  console.error("이력서 생성 실패:", error)
                  alert("이력서 생성 중 오류가 발생했습니다. 다시 시도해주세요.")
                } finally {
                  setIsGeneratingResume(false)
                }
              }}
              disabled={currentStep < steps.length - 1 || isGeneratingResume}
              className={`mt-6 w-full rounded-full py-3 text-center text-sm font-semibold text-white shadow-sm transition ${
                currentStep < steps.length - 1 || isGeneratingResume
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ff9330] hover:bg-[#f5851d]"
              }`}
              style={
                currentStep >= steps.length - 1 && !isGeneratingResume
                  ? { boxShadow: "0 12px 28px rgba(255,147,48,0.28)" }
                  : {}
              }
            >
              {isGeneratingResume ? "이력서 생성 중..." : "다음 단계로"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
