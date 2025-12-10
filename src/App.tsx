import { Route, Routes } from "react-router-dom"
import InterviewPage from "./pages/InterviewPage.tsx"
import MainPage from "./pages/MainPage.tsx"
import ResumePage from "./pages/ResumePage.tsx"
import CompanyReportPage from "./pages/CompanyReportPage.tsx"
import AgentTester from "./pages/AgentTester.tsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/company-report" element={<CompanyReportPage />} />
      <Route path="/history" element={<MainPage />} />
      <Route path="/settings" element={<MainPage />} />
      <Route path="/notifications" element={<MainPage />} />
      <Route path="/my-page" element={<MainPage />} />
      <Route path="/agent-tester" element={<AgentTester />} />
    </Routes>
  )
}
