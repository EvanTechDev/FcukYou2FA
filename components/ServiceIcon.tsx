import { FaGlobe } from "react-icons/fa"

interface ServiceIconProps {
  service?: string
  className?: string
}

export default function ServiceIcon({ service, className }: ServiceIconProps) {
  if (!service) {
    return <FaGlobe className={className} style={{ color: "#4A5568" }} />
  }

  // 构建网站 favicon URL
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${service}&sz=64`

  return (
    <img
      src={faviconUrl || "/placeholder.svg"}
      alt={`${service} icon`}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdsb2JlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ii8+PC9zdmc+"
      }}
    />
  )
}

