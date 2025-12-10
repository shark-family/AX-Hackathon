export type Role = 'assistant' | 'user'

export interface ChatMessage {
  id: string
  role: Role // 'assistant' = 메일이, 'user' = 지원자
  content: string
  createdAt: string
}

export interface InterviewSummary {
  name: string | null
  targetCompany: string | null
  targetJobTitle: string | null

  previousCompany: string | null
  previousJobTitle: string | null

  skills: string[]
  certificates: string[]
  achievements: string[]

  // 오른쪽 패널에 보여줄 한 줄 요약
  headline: string // 예: "신한은행 예금담보대출 마이그레이션 경험이 있는 백엔드 개발자"
}

export const defaultSummary: InterviewSummary = {
  name: null,
  targetCompany: null,
  targetJobTitle: null,
  previousCompany: null,
  previousJobTitle: null,
  skills: [],
  certificates: [],
  achievements: [],
  headline: '',
}

export interface CompanyInfo {
  title: string;
  content: string;
}

export interface FinancialStatus {
  title: string;
  content: string;
}

export interface Trends {
  title: string;
  content: string;
}

export interface JobAnalysis {
  title: string;
  overview: string;
  main_tasks: string[];
  required_skills: string[];
  career_path: string[];
}

export interface SeniorFit {
  title: string;
  strengths: string;
  key_challenges: string;
}

export interface CoachTip {
  title: string;
  content: string;
}

export interface RelatedNews {
  title: string;
  url: string;
  source: string;
  reason: string;
}

export interface ReportData {
  company_info: CompanyInfo;
  financial_status: FinancialStatus;
  trends: Trends;
  job_analysis: JobAnalysis;
  senior_fit: SeniorFit;
  coach_tip: CoachTip;
  related_news: RelatedNews[];
}
