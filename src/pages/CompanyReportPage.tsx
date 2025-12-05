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
            <p className="mt-4 text-xl font-semibold text-[#ff9330]">삼성전자 - 소프트웨어개발</p>
            <p className="mt-6 max-w-2xl mx-auto text-base text-gray-600">
              세계적인 기술 리더 기업에서 혁신을 주도하는 중요한 직무입니다. 신기술 습득과 깊이 있는 전문성을 바탕으로 시니어의 경험과 리더십을 발휘할 수 있는 기회가 많습니다.
            </p>
          </header>

          <Section icon={<HiBuildingOffice2 className="h-7 w-7 text-[#ff9330]" />} title="회사 정보 및 산업 분석">
            <p>
              삼성전자는 전자 제조 산업의 선두 주자로서 IT 및 통신 분야에 강력하게 집중하고 있습니다. 반도체, 스마트폰, 가전, TV, 컴퓨터 등 다양한 전자제품을 생산하며, AI 관련 기술에도 대규모 투자를 하고 있습니다. 전 세계적으로 12만 5천 명 이상의 직원을 고용하고, 연간 240조 원 이상의 매출을 기록하는 거대 글로벌 기업입니다. 핵심 사업은 반도체, 스마트폰, 가전제품 제조 및 판매이며, 특히 AI 반도체 및 스마트 기기 수요 증가에 맞춰 생산 및 R&D 역량을 강화하고 있습니다.
            </p>
          </Section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Section icon={<HiChartBarSquare className="h-7 w-7 text-green-500" />} title="재무 안정성 및 성장성">
              <p>
                삼성전자의 재무 데이터를 현재 상세하게 확인할 수는 없었으나, 삼성전자는 글로벌 시장에서 독보적인 위상을 가진 매우 크고 재무적으로 안정적인 기업입니다. 반도체, 스마트폰 등 주력 사업 분야에서 세계적인 경쟁력을 유지하고 있으며, AI 및 신기술 분야에 대한 과감한 투자를 통해 지속적인 성장 동력을 확보하고 있습니다. 따라서 장기적인 관점에서 매우 안정적인 고용 환경을 제공할 것으로 판단됩니다.
              </p>
            </Section>

            <Section icon={<HiNewspaper className="h-7 w-7 text-sky-500" />} title="최신 동향 및 근무 환경">
              <p>언론 보도에 따르면 삼성전자는 다음과 같은 특징을 보입니다.</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><span className="font-semibold">대규모 채용 및 미래 기술 집중:</span> 향후 5년간 6만 명의 신규 인력 채용 계획 발표, 특히 AI, 로봇 등 미래 핵심 산업에 집중.</li>
                  <li><span className="font-semibold">혁신적인 기업 문화 추구:</span> 소통, 공개 토론, 데이터 기반 실행을 강조하는 'C.O.R.E Work' 문화 프레임워크 도입.</li>
                  <li><span className="font-semibold">AI 트랜스포메이션:</span> AI를 제품 및 비즈니스 전반에 통합하여 'AI 중심 회사'로의 변혁 추구.</li>
                  <li><span className="font-semibold">리스크 점검:</span> 임금 체계를 둘러싼 노사 갈등 및 단기 성과주의, 관료주의와 같은 '대기업병'에 대한 우려 존재.</li>
              </ul>
            </Section>
          </div>

          <Section icon={<HiCodeBracket className="h-7 w-7 text-purple-500" />} title="직무 심층 분석: 소프트웨어개발">
            <p>삼성전자의 소프트웨어개발 직무는 매우 광범위하며, 모바일, 가전, 반도체, AI 등 다양한 사업 분야에서 혁신적인 솔루션을 구현하는 역할을 수행합니다. 시니어의 경우 다음과 같은 역할과 역량이 중요합니다.</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">주요 업무</h3>
                <p className="text-sm">아키텍처 설계, 복잡한 문제 해결, 신기술 도입, 프로세스 개선, 주니어 멘토링 및 기술 리더십.</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">요구 역량</h3>
                <p className="text-sm">특정 언어(C++, Java, Python 등) 숙련도, 시스템 설계 능력, 대규모 시스템 경험, 리더십 및 협업 능력.</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-bold text-gray-800">커리어 경로</h3>
                <p className="text-sm">Principal Engineer, Architect, Technical Lead, PM 또는 Director급으로 성장하여 기술 전략 주도.</p>
              </div>
            </div>
          </Section>

          <Section icon={<HiUserGroup className="h-7 w-7 text-teal-500" />} title="5060 시니어 적합성">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-green-600">강점</h3>
                <p>오랜 경험에서 비롯된 깊이 있는 기술 전문성, 시스템 전체를 조망하는 아키텍처 역량, 복잡한 문제 해결 능력, 그리고 후배를 이끄는 리더십.</p>
              </div>
              <div>
                <h3 className="font-bold text-red-600">핵심 과제</h3>
                <p>빠르게 변화하는 기술 트렌드(AI, 클라우드 등)에 대한 지속적인 학습과 최신 기술 적용 경험을 증명하는 것이 중요. 유연한 사고와 커뮤니케이션 역량도 필수.</p>
              </div>
            </div>
          </Section>

          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-4 mb-4">
              <HiLightBulb className="h-8 w-8 text-yellow-300" />
              <h2 className="text-2xl font-bold">Coach's Tip</h2>
            </div>
            <p className="font-medium leading-relaxed">
              면접 시에는 본인이 쌓아온 깊이 있는 기술 전문성과 함께, 최근 5~10년 이내에 어떤 최신 기술(AI/ML, 클라우드 등)을 학습하고 실제 프로젝트에 적용하여 어떤 성과를 창출했는지를 구체적인 사례를 들어 설명하는 것이 중요합니다. 단순한 경험 나열보다는, 문제 해결 과정에서의 본인의 역할, 기여도, 그리고 특히 시니어로서 발휘할 수 있는 리더십과 멘토링 역량을 강조하세요. 삼성전자가 추구하는 AI 변혁(AX) 전략에 대한 이해를 바탕으로, 본인이 회사의 미래 성장에 어떻게 기여할 수 있을지에 대한 비전을 제시한다면 좋은 결과를 얻을 수 있을 것입니다.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
