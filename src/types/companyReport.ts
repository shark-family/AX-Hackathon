export interface CompanyReport {
  companyName: string
  jobTitle: string
  intro: string // 기업 및 직무 분석 소개
  companyInfo: string // 회사 정보 및 산업 분석
  financialStability: string // 재무 안정성 및 성장성
  latestTrends: {
    description: string
    items: Array<{
      title: string
      content: string
    }>
  }
  jobAnalysis: {
    description: string
    mainTasks: string
    requiredSkills: string
    careerPath: string
  }
  seniorFit: {
    strengths: string
    challenges: string
  }
  coachTip: string
}

