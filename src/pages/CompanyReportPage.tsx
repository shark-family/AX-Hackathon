import { useNavigate } from "react-router-dom"
import {
  HiBuildingOffice2,
  HiChartBarSquare,
  HiCodeBracket,
  HiLightBulb,
  HiLink,
  HiNewspaper,
  HiUserGroup,
} from "react-icons/hi2"
import Header from "../components/Header.tsx"
import { useInterviewStore } from "../stores/interviewStore.ts"

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
  const { reportData } = useInterviewStore()

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-600">리포트 데이터를 불러오는 중입니다...</p>
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
            <p className="mt-4 text-xl font-semibold text-[#ff9330]">
              {reportData.company_info.content.split(' ')[0]} - {reportData.job_analysis.title}
            </p>
          </header>

          <Section icon={<HiBuildingOffice2 className="h-7 w-7 text-[#ff9330]" />} title={reportData.company_info.title}>
            <p>{reportData.company_info.content}</p>
          </Section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Section icon={<HiChartBarSquare className="h-7 w-7 text-green-500" />} title={reportData.financial_status.title}>
              <p>{reportData.financial_status.content}</p>
            </Section>

            <Section icon={<HiNewspaper className="h-7 w-7 text-sky-500" />} title={reportData.trends.title}>
               <p>{reportData.trends.content}</p>
            </Section>
          </div>

          <Section icon={<HiCodeBracket className="h-7 w-7 text-purple-500" />} title={reportData.job_analysis.title}>
            <p>{reportData.job_analysis.overview}</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">주요 업무</h3>
                <ul className="text-sm list-disc list-inside mt-2">
                  {reportData.job_analysis.main_tasks.map(task => <li key={task}>{task}</li>)}
                </ul>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">요구 역량</h3>
                <ul className="text-sm list-disc list-inside mt-2">
                  {reportData.job_analysis.required_skills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">커리어 경로</h3>
                <ul className="text-sm list-disc list-inside mt-2">
                  {reportData.job_analysis.career_path.map(path => <li key={path}>{path}</li>)}
                </ul>
              </div>
            </div>
          </Section>

          <Section icon={<HiUserGroup className="h-7 w-7 text-teal-500" />} title={reportData.senior_fit.title}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-green-600">강점</h3>
                <p>{reportData.senior_fit.strengths}</p>
              </div>
              <div>
                <h3 className="font-bold text-red-600">핵심 과제</h3>
                <p>{reportData.senior_fit.key_challenges}</p>
              </div>
            </div>
          </Section>
          
          <Section icon={<HiLink className="h-7 w-7 text-blue-500" />} title="관련 뉴스">
            <div className="space-y-4">
              {reportData.related_news.map(news => (
                <div key={news.title} className="rounded-lg border bg-gray-50 p-4">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">{news.title}</a>
                  <p className="text-sm text-gray-500 mt-1">{news.source}</p>
                  <p className="text-sm mt-2">{news.reason}</p>
                </div>
              ))}
            </div>
          </Section>

          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <HiLightBulb className="h-8 w-8 text-yellow-300" />
              <h2 className="text-2xl font-bold">{reportData.coach_tip.title}</h2>
            </div>
            {reportData.coach_tip.content.split('\n').map((line, index) => (
              <p key={index} className="font-medium leading-relaxed">{line}</p>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
