import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  HiBuildingOffice2,
  HiChartBarSquare,
  HiCodeBracket,
  HiLightBulb,
  HiNewspaper,
  HiUserGroup,
} from "react-icons/hi2"
import Header from "../components/Header.tsx"
import { useInterviewStore } from "../stores/interviewStore.ts"
import { generateCompanyReport } from "../services/llmService.ts"
import type { CompanyReport } from "../types/companyReport.ts"

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
  </section>
)

export default function CompanyReportPage() {
  const navigate = useNavigate()
  const { summary } = useInterviewStore()
  const [report, setReport] = useState<CompanyReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCompanyReport = async () => {
      // 인터뷰 데이터가 없으면 이전 페이지로 리다이렉트
      if (!summary.targetCompany && !summary.targetJobTitle) {
        navigate("/interview")
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const generatedReport = await generateCompanyReport(summary)
        setReport(generatedReport)
      } catch (err) {
        console.error("기업 분석 리포트 생성 실패:", err)
        setError(err instanceof Error ? err.message : "기업 분석 리포트 생성 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyReport()
  }, [summary, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9330] mb-4"></div>
              <p className="text-lg text-gray-600">기업 분석 리포트를 생성하는 중...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-lg text-red-600 mb-4">{error || "기업 분석 리포트를 불러올 수 없습니다."}</p>
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg bg-[#ff9330] px-6 py-2 text-white hover:bg-[#f5851d] transition"
              >
                이전으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Header />

        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            이전으로 돌아가기
          </button>
        </div>

        <main className="space-y-8">
          <header className="rounded-2xl bg-white p-8 text-center shadow-lg">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">기업 및 직무 분석</h1>
            <p className="mt-4 text-xl font-semibold text-[#ff9330]">{report.companyName} - {report.jobTitle}</p>
            <p className="mt-6 max-w-2xl mx-auto text-base text-gray-600">
              {report.intro}
            </p>
          </header>

          <Section icon={<HiBuildingOffice2 className="h-7 w-7 text-[#ff9330]" />} title="회사 정보 및 산업 분석">
            <p>{report.companyInfo}</p>
          </Section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Section icon={<HiChartBarSquare className="h-7 w-7 text-green-500" />} title="재무 안정성 및 성장성">
              <p>{report.financialStability}</p>
            </Section>

            <Section icon={<HiNewspaper className="h-7 w-7 text-sky-500" />} title="최신 동향 및 근무 환경">
              <p>{report.latestTrends.description}</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                {report.latestTrends.items.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold">{item.title}:</span> {item.content}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <Section icon={<HiCodeBracket className="h-7 w-7 text-purple-500" />} title={`직무 심층 분석: ${report.jobTitle}`}>
            <p>{report.jobAnalysis.description}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">주요 업무</h3>
                <p className="text-sm">{report.jobAnalysis.mainTasks}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">요구 역량</h3>
                <p className="text-sm">{report.jobAnalysis.requiredSkills}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">커리어 경로</h3>
                <p className="text-sm">{report.jobAnalysis.careerPath}</p>
              </div>
            </div>
          </Section>

          <Section icon={<HiUserGroup className="h-7 w-7 text-teal-500" />} title="5060 시니어 적합성">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-green-600">강점</h3>
                <p>{report.seniorFit.strengths}</p>
              </div>
              <div>
                <h3 className="font-bold text-red-600">핵심 과제</h3>
                <p>{report.seniorFit.challenges}</p>
              </div>
            </div>
          </Section>

          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <HiLightBulb className="h-8 w-8 text-yellow-300" />
              <h2 className="text-2xl font-bold">Coach's Tip</h2>
            </div>
            <p className="font-medium leading-relaxed">
              {report.coachTip}
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
