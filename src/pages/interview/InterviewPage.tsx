import ChatBubble from "../../components/ChatBubble.tsx"
import Header from "../../components/Header.tsx"
import SummaryPanel from "../../components/SummaryPanel.tsx"
import MicIcon from "./components/MicIcon.tsx"
import SendIcon from "./components/SendIcon.tsx"
import { useInterview } from "./hooks/useInterview.ts"

export default function InterviewPage() {
  const {
    messages,
    isLoadingSummary,
    isThinking,
    steps,
    inputValue,
    setInputValue,
    displayName,
    isGeneratingResume,
    currentStep,
    progressPercent,
    handleSend,
    handleGenerateResume,
    isSending,
  } = useInterview()

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
              {isThinking && <ChatBubble sender="interviewer" name="매일이" message="" pending={true} />}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                className="flex-1 border-none text-sm outline-none placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="답변을 입력하세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoadingSummary || isThinking || isSending}
                onKeyDown={(e) => {
                  const nativeEvent = e.nativeEvent as KeyboardEvent
                  if (nativeEvent.isComposing) return
                  if (e.key === "Enter" && !isLoadingSummary && !isThinking && !isSending) {
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
                disabled={isLoadingSummary || isThinking || !inputValue.trim() || isSending}
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
              onClick={handleGenerateResume}
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
