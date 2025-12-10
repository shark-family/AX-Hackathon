const MicIcon = ({ className, color = "#8c9099" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
    <path d="M12 18v3" />
    <path d="M9 21h6" />
  </svg>
)

export default MicIcon;
