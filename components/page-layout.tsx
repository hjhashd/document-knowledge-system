import type React from "react"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  // 全局布局已在 app/layout.tsx 中提供 Sidebar/Header/Main。
  // 这里保持透明包装以兼容现有页面结构。
  return <>{children}</>
}
