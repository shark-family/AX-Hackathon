/**
 * 타이핑 인디케이터 컴포넌트
 * AI가 응답을 생성하는 동안 표시되는 애니메이션
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">
        <div 
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }} 
        />
        <div 
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }} 
        />
        <div 
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }} 
        />
      </div>
      <span className="ml-2 text-xs text-gray-500">메일이가 생각 중이에요...</span>
    </div>
  )
}

