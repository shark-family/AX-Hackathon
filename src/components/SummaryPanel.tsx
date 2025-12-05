import { useInterviewStore } from '../stores/interviewStore'

const PenIcon = ({ className, color = "#c0c4cc" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="m12.7 5.3 4 4L8 18H4v-4l8.7-8.7Z" />
    <path d="m14.5 3.5 2 2" />
  </svg>
)

export default function SummaryPanel() {
  const { summary, isLoadingSummary, error } = useInterviewStore()

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">실시간 요약 정보</h3>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          <PenIcon className="h-4 w-4" />
          수정
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoadingSummary && (
        <div className="mt-4 text-sm text-gray-500">요약 정보를 업데이트하는 중...</div>
      )}

      <div className="mt-6 space-y-5 text-sm text-gray-600">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500">기본 정보</div>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">이름</span>
                <span className="font-medium text-gray-800">
                  {summary.name || '입력 없음'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">지원회사</span>
                <span className="font-medium text-gray-800">
                  {summary.targetCompany || '입력 없음'}
                </span>
              </div>
              {summary.targetJobTitle && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">지원직무</span>
                  <span className="font-medium text-gray-800">
                    {summary.targetJobTitle}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500">주요경력</div>
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 whitespace-pre-line">
            {summary.headline || '아직 입력된 정보가 없습니다.'}
          </div>
        </div>

        {summary.skills.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500">보유 기술</div>
            <div className="flex flex-wrap gap-2">
              {summary.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {summary.certificates.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500">자격증</div>
            <div className="flex flex-wrap gap-2">
              {summary.certificates.map((cert, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

