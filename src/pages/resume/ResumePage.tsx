import Header from "../../components/Header.tsx"
import DownloadIcon from "./components/DownloadIcon.tsx"
import DocumentIcon from "./components/DocumentIcon.tsx"
import SparkleIcon from "./components/SparkleIcon.tsx"
import InfoIcon from "./components/InfoIcon.tsx"
import BriefcaseIcon from "./components/BriefcaseIcon.tsx"
import { useResume } from "./hooks/useResume.ts"

export default function ResumePage() {
  const {
    resumePdfUrl,
    resumePdfBlob,
    summary,
    selectedFormat,
    setSelectedFormat,
    scale,
    changeScale,
    handleDownload,
    navigateToCompanyReport,
  } = useResume()

  if (!resumePdfUrl && !resumePdfBlob) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Header />

        <div className="mt-6 grid grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-3xl bg-[#f5e6d3] p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{summary.name || "지원자"}님의 이력서</h1>
              <p className="mt-2 text-sm text-gray-600">
                완성된 문서를 확인하고, 원하는 파일 형식으로 다운로드하세요.
              </p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-lg bg-white/50 px-4 py-2">
              <span className="text-sm font-medium text-gray-700">2/2 페이지</span>
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

          <div className="space-y-6">
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

            <button
              onClick={navigateToCompanyReport}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff9330] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d] transition"
            >
              <BriefcaseIcon className="h-5 w-5" />
              기업 레포트 보기
            </button>

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

