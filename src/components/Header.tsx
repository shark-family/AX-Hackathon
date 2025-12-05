import { useLocation, useNavigate } from "react-router-dom"
import { HiBell, HiClock, HiCog, HiHome, HiUser } from "react-icons/hi"

const NavItem = ({
  to,
  icon,
  children,
}: {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#ff9330] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex items-center justify-between">
      <button className="hover:opacity-75 transition" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="내일로 로고" className="h-8 w-auto" />
      </button>
      <div className="flex items-center gap-2">
        <NavItem to="/" icon={<HiHome className="h-5 w-5" />}>
          홈
        </NavItem>
        <NavItem to="/history" icon={<HiClock className="h-5 w-5" />}>
          나의 기록
        </NavItem>
        <NavItem to="/settings" icon={<HiCog className="h-5 w-5" />}>
          설정
        </NavItem>
        <NavItem to="/notifications" icon={<HiBell className="h-5 w-5" />}>
          알림
        </NavItem>
        <NavItem to="/my-page" icon={<HiUser className="h-5 w-5" />}>
          마이
        </NavItem>
      </div>
    </div>
  )
}

