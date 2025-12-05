import Header from "../components/Header.tsx"
import { useNavigate } from "react-router-dom"

const stories = [
  {
    stars: "★★★★★",
    title: "말만 했는데 이력서가 만들어졌어요.",
    body: "AI가 제 이야기를 천천히 들어주고, 복잡했던 경력을 깔끔하게 정리해줬습니다. 글쓰기가 어려웠던 저에게 정말 큰 도움이 됐어요.",
    footer: "이○○ · 60세 / 사무관리",
  },
  {
    stars: "★★★★☆",
    title: "매일경제 덕분에 어디에 지원해야 할지 알게 됐어요.",
    body: "시장 변화와 기업별 이슈를 AI가 쉽게 설명해줘서 제 경력과 맞는 회사를 바로 찾을 수 있었습니다. 막막했던 재취업 준비가 훨씬 명확해졌어요.",
    footer: "박○○ · 58세 / 생산직",
  },
  {
    stars: "★★★★★",
    title: "30년 경력을 이렇게 정리해준 곳은 처음입니다.",
    body: "제가 해온 일들이 어떻게 연결되는지 AI가 구조화해서 보여주니 제 강점이 명확히 보였어요. 면접 때도 이 흐름이 큰 도움이 됐습니다.",
    footer: "김○○ · 63세 / 회계관리",
  },
  {
    stars: "★★★★☆",
    title: "나의 벽을 넘을 수 있었어요.",
    body: "AI가 제 경력 속에서 강점을 찾아내 주니 오히려 내가 강점에만 힘 쓸 수 있다는 걸 실감했습니다. 이해하는 느낌이 정말 컸어요.",
    footer: "윤○○ · 55세 / 회계 보조",
  },
]

export default function MainPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header />

        <div className="rounded-3xl bg-white px-10 py-12 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#ff9330]">내일로</span>
              <span className="text-sm font-medium text-gray-400">X</span>
              <span className="text-lg font-semibold text-[#ff9330]">MK</span>
            </div>
            <h1 className="text-3xl font-bold leading-snug text-gray-900">
              당신의 경험이 다시 빛날 시간,
              <br />
              <span className="text-[#ff9330]"> 내일로</span>와 함께 새로운 시작을 준비하세요.
            </h1>
            <p className="text-sm text-gray-600">
              AI 기반 맞춤 이력서 생성, 기업 분석까지. 재취업의 모든 과정에 함께합니다.
            </p>
            <button
              onClick={() => navigate("/interview")}
              className="mt-2 rounded-full bg-[#ff9330] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#f5851d]"
              style={{ boxShadow: "0 10px 26px rgba(255,147,48,0.28)" }}
            >
              AI 인터뷰 시작하기
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-[#ffe6d6] px-6 py-10 md:px-10">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">먼저 경험한 분들의 성공 스토리</h2>

          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {stories.map((story) => (
                <div key={story.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-yellow-400">{story.stars}</div>
                  <p className="mt-3 text-sm font-semibold leading-snug text-gray-900">{story.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{story.body}</p>
                  <p className="mt-3 text-[11px] font-medium text-gray-500">{story.footer}</p>
                </div>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="overflow-hidden rounded-[28px] bg-gray-200 shadow-lg">
                <img
                  src="../../public/human.png"
                  alt="재취업 성공 스토리"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80"
                  }}
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-5 py-3 shadow-lg">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-base text-blue-600">
                    ✓
                  </span>
                  <div className="leading-tight">
                    <div className="text-gray-700">취업성공률</div>
                    <div className="text-lg font-bold text-blue-600">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white px-8 py-10 shadow-sm">
          <h2 className="mb-6 text-center text-lg font-semibold text-gray-800">AI가 완성하는 당신의 새로운 무기</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-blue-50 to-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-blue-600">AI 인터뷰</div>
              <p className="mt-2 text-sm font-semibold text-gray-800">AI와 편안하게 대화를 나누세요.</p>
              <p className="mt-2 text-xs text-gray-600">실시간 질문과 요약으로 나만의 스토리를 정리합니다.</p>
              <div className="mt-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                <img src="/g1.png" alt="AI 인터뷰" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-green-50 to-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-green-600">이력서 자동 생성</div>
              <p className="mt-2 text-sm font-semibold text-gray-800">직무 경험을 바탕으로 맞춤 이력서를 제공합니다.</p>
              <p className="mt-2 text-xs text-gray-600">AI가 핵심 역량을 정리해주는 빠른 작성 경험.</p>
              <div className="mt-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                <img src="/g2.png" alt="이력서 자동 생성" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-orange-50 to-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-orange-600">직무 분석</div>
              <p className="mt-2 text-sm font-semibold text-gray-800">기업/직무 분석을 통해 준비도를 높입니다.</p>
              <p className="mt-2 text-xs text-gray-600">매칭률과 인사이트로 더 정확한 지원 전략 수립.</p>
              <div className="mt-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                <img src="/g3.png" alt="직무 분석" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

