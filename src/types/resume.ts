export interface ResumeData {
  name: string
  birthdate: string
  address: string
  photo_path: string
  phone: string
  email: string
  emergency_contact: string
  education: Education[]
  experience: Experience[]
  certifications: Certification[]
}

export interface Education {
  institution: string
  degree?: string
  period: string
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
}

export interface Certification {
  title: string
  issuer?: string
  score?: string
  date: string
}

export interface SelfIntro {
  q1_question: string
  q1_answer: string
  q2_question: string
  q2_answer: string
  q3_question: string
  q3_answer: string
}

export interface ResumeDataWithSelfIntro extends ResumeData {
  self_intro?: SelfIntro
  cover_letter?: Array<{ question: string; answer: string }>
}

