import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChatBubble from "../components/ChatBubble.tsx"
import Header from "../components/Header.tsx"

type Message = { sender: "interviewer" | "candidate"; text: string; step: number }

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

const PenIcon = ({ className, color = "#c0c4cc" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="m12.7 5.3 4 4L8 18H4v-4l8.7-8.7Z" />
    <path d="m14.5 3.5 2 2" />
  </svg>
)

export default function InterviewPage() {
  const navigate = useNavigate()
  const steps = ["기본 정보", "경력 사항", "개인의 강점", "희망 직무", "최종 확인"]
  const [currentStep, setCurrentStep] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [answers, setAnswers] = useState({
    basic: "",
    career: "",
    strength: "",
    role: "",
  })
  const [messages, setMessages] = useState<Message[]>([])

  const progressPercent = ((currentStep + 1) / steps.length) * 100

  const extractNameAndCompany = (text: string) => {
    // 쉼표로 구분된 경우: "김매경, 삼성" -> 첫 번째는 이름, 두 번째는 회사
    if (text.includes(",")) {
      const parts = text.split(",").map((p) => p.trim())
      if (parts.length >= 2) {
        const name = parts[0].replace(/^(제|저는|저)\s*이름은?\s*/i, "").trim()
        const company = parts[1].replace(/^(지원|회사|희망|직무)\s*(?:은|는|이|가)?\s*/i, "").trim()
        if (name && /^[가-힣]{2,}$/.test(name)) {
          return { name, company: company || "" }
        }
      }
    }

    // 이름 먼저 찾기 (한글 이름 패턴: 성씨 + 이름)
    const namePatterns = [
      /(?:이름은|이름이|제\s*이름은|이름|저는|저)\s*([가-힣]{2,4})/,
      /^([가-힣]{2,4})(?:\s|,|$)/, // 시작 부분의 한글 이름
    ]
    
    let foundName = ""
    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match?.[1] && /^[가-힣]{2,4}$/.test(match[1])) {
        foundName = match[1]
        break
      }
    }

    // 이름을 제외한 나머지 텍스트에서 회사 찾기
    const remainingText = foundName ? text.replace(foundName, "").trim() : text
    
    // 회사명 패턴
    const companyPatterns = [
      /(?:지원|회사|희망|원하시는\s*회사|지원을\s*원하시는\s*회사|직무)\s*(?:은|는|이|가)?\s*([가-힣A-Za-z]+)/,
      /([가-힣]{2,}(?:경제|전자|기업|그룹|회사|은행|증권|보험))/,
    ]
    
    let foundCompany = ""
    for (const pattern of companyPatterns) {
      const match = remainingText.match(pattern)
      if (match?.[1] && match[1].length >= 2) {
        foundCompany = match[1]
        break
      }
    }
    
    // 회사명 키워드 직접 검색
    if (!foundCompany) {
      const companyKeywords = ["매일경제", "매경", "삼성", "LG", "SK", "현대", "네이버", "카카오", "KT", "롯데"]
      for (const keyword of companyKeywords) {
        if (remainingText.includes(keyword)) {
          foundCompany = keyword === "매경" ? "매일경제" : keyword
          break
        }
      }
    }
    
    return { name: foundName || "", company: foundCompany || "" }
  }

  const getPromptForStep = (step: number) => {
    const name = displayName || "지원자님"
    if (step === 0)
      return "안녕하세요! 인터뷰를 시작하겠습니다. 먼저 성함과 지원을 원하시는 회사 및 직무를 말씀해주시겠어요?"
    if (step === 1) return "이전에는 어떤 회사에서 업무를 하셨나요? 또, 어떤 성과를 내셨나요?"
    if (step === 2)
      return `${name}님은 어떤 기술을 가장 잘 활용하시나요? 또는 어떤 부분에서 강점을 갖고 계신가요? 관련 수상이나 자격증도 어필해주세요!`
    if (step === 3) {
      const careerText = answers.career || name
      return `${careerText}에서 무슨 일을 하고 싶으세요? 구체적으로 말씀해주시면 보다 구체적인 피드백이 가능합니다!`
    }
    return ""
  }

  useEffect(() => {
    setMessages([{ sender: "interviewer", text: getPromptForStep(0), step: 0 }])
  }, [])

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const stepKeyMap: Record<number, keyof typeof answers> = {
      0: "basic",
      1: "career",
      2: "strength",
      3: "role",
      4: "role",
    }

    if (currentStep === 0) {
      const { name, company } = extractNameAndCompany(trimmed)
      if (name) setDisplayName(name)
      if (company) setCompanyName(company)
    }

    setAnswers((prev) => ({ ...prev, [stepKeyMap[currentStep]]: trimmed }))
    setMessages((prev) => {
      const userAdded: Message[] = [...prev, { sender: "candidate", text: trimmed, step: currentStep }]
      const closing = "감사합니다! 이제 우측 다음 단계를 눌러서 완성된 이력서를 확인하세요!"

      if (currentStep === steps.length - 2) {
        const alreadySent = prev.some(
          (m) => m.sender === "interviewer" && m.text === closing && m.step === currentStep + 1,
        )
        return alreadySent
          ? userAdded
          : [...userAdded, { sender: "interviewer", text: closing, step: currentStep + 1 }]
      }

      if (currentStep >= steps.length - 1) {
        const alreadySent = prev.some(
          (m) => m.sender === "interviewer" && m.text === closing && m.step === currentStep,
        )
        return alreadySent ? userAdded : [...userAdded, { sender: "interviewer", text: closing, step: currentStep }]
      }

      const nextStep = currentStep + 1
      const nextPrompt = getPromptForStep(nextStep)
      return nextPrompt
        ? [...userAdded, { sender: "interviewer", text: nextPrompt, step: nextStep }]
        : userAdded
    })
    setInputValue("")

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
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
              {messages.map((msg, idx) => (
                <ChatBubble
                  key={`${msg.step}-${idx}-${msg.sender}`}
                  sender={msg.sender}
                  name={msg.sender === "interviewer" ? "매일이" : displayName}
                  message={msg.text}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                className="flex-1 border-none text-sm outline-none placeholder:text-gray-400"
                placeholder="답변을 입력하세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  const nativeEvent = e.nativeEvent as KeyboardEvent
                  if (nativeEvent.isComposing) return
                  if (e.key === "Enter") {
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
                className="flex items-center gap-2 rounded-full bg-[#ff9330] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d]"
                style={{ boxShadow: "0 8px 24px rgba(255,147,48,0.28)" }}
              >
                <SendIcon className="h-4 w-4" />
                전송
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">실시간 요약 정보</h3>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                <PenIcon className="h-4 w-4" />
                수정
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500">기본 정보</div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">이름</span>
                      <span className="font-medium text-gray-800">
                        {displayName || "입력 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">지원회사</span>
                      <span className="font-medium text-gray-800">
                        {companyName || "입력 없음"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500">주요경력</div>
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 whitespace-pre-line">
                  {answers.career || "아직 입력된 정보가 없습니다."}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/resume")}
              disabled={currentStep < steps.length - 1}
              className={`mt-6 w-full rounded-full py-3 text-center text-sm font-semibold text-white shadow-sm transition ${
                currentStep < steps.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ff9330] hover:bg-[#f5851d]"
              }`}
              style={
                currentStep >= steps.length - 1
                  ? { boxShadow: "0 12px 28px rgba(255,147,48,0.28)" }
                  : {}
              }
            >
              다음 단계로
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

