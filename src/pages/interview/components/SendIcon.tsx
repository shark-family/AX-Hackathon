const SendIcon = ({ className, color = "#ffffff" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M4 4 20 12 4 20l3-8-3-8Z" />
  </svg>
)

export default SendIcon;
