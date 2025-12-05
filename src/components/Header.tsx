import { useNavigate } from "react-router-dom"

type IconProps = {
  className?: string
  color?: string
}

const HomeIcon = ({ className, color = "#c0c4cc" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5V14h-5V21H5a1 1 0 0 1-1-1v-9.5Z" />
  </svg>
)

const ClockIcon = ({ className, color = "#c0c4cc" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const BellIcon = ({ className, color = "#c0c4cc" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M6 16a6 6 0 0 1 12 0" />
    <path d="M5 15v-3a7 7 0 1 1 14 0v3l1 1v1H4v-1l1-1Z" />
    <path d="M10 18a2 2 0 0 0 4 0" />
  </svg>
)

const SettingIcon = ({ className, color = "#c0c4cc" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .68.4 1.3 1.01 1.58.3.14.64.22.99.22H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
)

const UserIcon = ({ className, color = "#c0c4cc" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M6 19.5c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5" />
  </svg>
)

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-700">interview</div>
      <div className="flex items-center gap-5 text-sm text-gray-600">
        <button className="flex items-center gap-2 hover:text-gray-800 transition" onClick={() => navigate("/")}>
          <HomeIcon className="h-5 w-5" />
          <span>홈</span>
        </button>
        <div className="flex items-center gap-2 hover:text-gray-800 transition">
          <ClockIcon className="h-5 w-5" />
          <span>나의 기록</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-800 transition">
          <SettingIcon className="h-5 w-5" />
          <span>설정</span>
        </div>
        <div className="flex items-center gap-2 hover:text-gray-800 transition">
          <BellIcon className="h-5 w-5" />
          <span>알림</span>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          <span>마이</span>
        </div>
      </div>
    </div>
  )
}

