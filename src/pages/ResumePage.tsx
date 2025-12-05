<<<<<<< HEAD
import { useState } from "react"
=======
import { useState, useEffect } from "react"
>>>>>>> 90738f8 ([FEAT] 이력서-인터뷰 내용 API연결)
import { useNavigate } from "react-router-dom"
import Header from "../components/Header.tsx"
import { useInterviewStore } from "../stores/interviewStore.ts"

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
)

export default function ResumePage() {
  const navigate = useNavigate()
  const { resumePdfUrl, summary } = useInterviewStore()
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "HWP" | "DOCX">("PDF")
  const [scale, setScale] = useState(1)
<<<<<<< HEAD
  const navigate = useNavigate()
=======
  
  // PDF URL이 없으면 인터뷰 페이지로 리다이렉트
  useEffect(() => {
    if (!resumePdfUrl) {
      navigate("/interview")
    }
  }, [resumePdfUrl, navigate])
  
  // 컴포넌트 언마운트 시 URL 해제
  useEffect(() => {
    return () => {
      if (resumePdfUrl) {
        URL.revokeObjectURL(resumePdfUrl)
      }
    }
  }, [resumePdfUrl])
>>>>>>> 90738f8 ([FEAT] 이력서-인터뷰 내용 API연결)

  const changeScale = (delta: number) => {
    setScale((prev) => Math.min(2, Math.max(0.6, parseFloat((prev + delta).toFixed(2)))))
  }

  const handleDownload = async () => {
    if (!resumePdfUrl) return
    
    try {
      // Blob URL에서 Blob을 가져옴
      const response = await fetch(resumePdfUrl)
      if (!response.ok) {
        throw new Error('PDF 다운로드 실패')
      }
      
      const blob = await response.blob()
      
      // Blob을 다운로드
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `resume_${summary.name || "지원자"}.pdf`
      link.style.display = "none"
      
      document.body.appendChild(link)
      link.click()
      
      // 정리
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('다운로드 실패:', error)
      alert('다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }
  
  if (!resumePdfUrl) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Header />

        <div className="mt-6 grid grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Left Panel - Resume Preview */}
          <div className="rounded-3xl bg-[#f5e6d3] p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{summary.name || "지원자"}님의 이력서</h1>
              <p className="mt-2 text-sm text-gray-600">
                완성된 문서를 확인하고, 원하는 파일 형식으로 다운로드하세요.
              </p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-lg bg-white/50 px-4 py-2">
              <span className="text-sm font-medium text-gray-700">1/1 페이지</span>
              <div className="flex gap-3">
                <button
                  onClick={() => changeScale(-0.1)}
                  className="rounded-lg px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-white/70 transition"
                  aria-label="축소"
                >
                  −
                </button>
                <button
                  onClick={() => changeScale(0.1)}
                  className="rounded-lg px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-white/70 transition"
                  aria-label="확대"
                >
                  +
                </button>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="relative rounded-2xl bg-white p-4 shadow-lg">
              <div className="overflow-auto rounded-xl border bg-gray-50" style={{ height: "70vh" }}>
                <div
                  className="origin-top-left"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: `${100 / scale}%`,
                  }}
                >
                  <object
                    data={`${resumePdfUrl}#toolbar=0`}
                    type="application/pdf"
                    className="h-[1200px] w-full"
                  >
                    <p className="p-4 text-sm text-gray-600">
                      PDF 미리보기를 불러올 수 없습니다. 파일을 직접 다운로드해 확인하세요.
                    </p>
                  </object>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className="space-y-6">
            {/* File Format Selection */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">완성된 문서 활용하기</h3>

              <div className="mb-4">
                <div className="mb-2 text-sm font-medium text-gray-700">파일 형식 선택</div>
                <div className="flex gap-2">
                  {(["PDF", "HWP", "DOCX"] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        selectedFormat === format
                          ? "bg-[#ff9330] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff9330] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d] transition"
              >
                <DownloadIcon className="h-5 w-5" />
                이력서 다운로드
              </button>
            </div>

            {/* AI Features */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">추가 옵션</h3>

              <div className="space-y-3">
                <button className="relative flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition">
                  <DocumentIcon className="h-5 w-5 flex-shrink-0 text-gray-600" />
                  <span className="flex-1 text-sm font-medium text-gray-800">기업 맞춤 버전 재생성</span>
                </button>

                <button className="relative flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50 transition">
                  <SparkleIcon className="h-5 w-5 flex-shrink-0 text-gray-600" />
                  <span className="flex-1 text-sm font-medium text-gray-800">문장 다듬기 (AT)</span>
                </button>
              </div>
            </div>

            {/* Company Report Button */}
            <button
              onClick={() => navigate("/company-report")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff9330] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d] transition"
            >
              <BriefcaseIcon className="h-5 w-5" />
              기업 레포트 보기
            </button>

            {/* Info */}
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
              <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                다운로드 후에도 언제든지 '내 문서함'에서 다시 수정하거나 다운로드할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

