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

