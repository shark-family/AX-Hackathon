type ChatBubbleProps = {
  sender: "interviewer" | "candidate"
  name: string
  message: string
  time?: string
}

export default function ChatBubble({ sender, name, message, time }: ChatBubbleProps) {
  const isInterviewer = sender === "interviewer"
  return (
    <div className={`flex ${isInterviewer ? "justify-start" : "justify-end"}`}>
      <div className={`flex gap-3 max-w-[620px] ${isInterviewer ? "flex-row" : "flex-row-reverse"}`}>
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 grid place-items-center text-sm font-semibold text-blue-800">
            {isInterviewer ? "M" : "K"}
          </div>
        </div>
        <div className={`flex flex-col ${isInterviewer ? "" : "items-end"}`}>
          <span className="mb-1 text-xs text-gray-500">{name}</span>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              isInterviewer ? "bg-white text-gray-800" : "bg-[#ffefe0] text-[#b15f2d]"
            }`}
          >
            {message}
          </div>
          {time ? <span className="mt-1 text-[11px] text-gray-400">{time}</span> : null}
        </div>
      </div>
    </div>
  )
}

