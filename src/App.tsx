import { Route, Routes } from "react-router-dom"
import InterviewPage from "./pages/InterviewPage.tsx"
import MainPage from "./pages/MainPage.tsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/interview" element={<InterviewPage />} />
    </Routes>
  )
}
