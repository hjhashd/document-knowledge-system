"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Brain,
  BarChart3,
  Settings,
  Network,
  MessageSquare,
  Database,
  GitCompare,
  FolderOpen,
  Tags,
  FileCheck,
  Stamp,
  AlertTriangle,
  Shuffle,
  Download,
  Sparkles,
  Cpu,
  Eye,
  Search,
  ChevronDown,
  ChevronRight,
  Layers,
  BookOpen,
  Shield,
  Building2,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

const navigation = [
  { name: "仪表板", href: "/", icon: BarChart3 },

  // 底层逻辑部分 - 基础技术能力
  {
    category: "底层逻辑",
    icon: Layers,
    items: [
      { name: "文档识别", href: "/upload", icon: Eye },
      { name: "文档解析", href: "/parsing", icon: FileCheck },
      { name: "信息抽取", href: "/extraction", icon: Search },
      { name: "格式转换", href: "/format-conversion", icon: Shuffle },
      { name: "文档比对", href: "/comparison", icon: GitCompare },
    ],
  },

  // 业务逻辑部分 - 具体业务应用
  {
    category: "文档管理",
    icon: BookOpen,
    items: [
      { name: "文件夹管理", href: "/folders", icon: FolderOpen },
      { name: "标签管理", href: "/tags", icon: Tags },
      { name: "文档编辑", href: "/document-edit", icon: FileText },
      { name: "智能标签", href: "/smart-tags", icon: Sparkles },
    ],
  },

  {
    category: "知识管理",
    icon: Brain,
    items: [
      { name: "知识提取", href: "/knowledge-extraction", icon: FileText },
      { name: "AI文档解读", href: "/ai-analysis", icon: Cpu },
      { name: "知识问答", href: "/qa", icon: MessageSquare },
      { name: "知识分类", href: "/knowledge-classification", icon: Network },
      { name: "内容总结", href: "/content-summary", icon: FileText },
      { name: "结果问答", href: "/result-qa", icon: MessageSquare },
    ],
  },

  {
    category: "合同审查",
    icon: Shield,
    items: [
      { name: "公章抽取", href: "/seal-extraction", icon: Stamp },
      { name: "手写文字提取", href: "/handwriting-extraction", icon: FileText },
      { name: "风险识别", href: "/risk-identification", icon: AlertTriangle },
    ],
  },

  {
    category: "企业应用",
    icon: Building2,
    items: [
      { name: "数据导出", href: "/data-export", icon: Download },
      { name: "数据管理", href: "/data", icon: Database },
      { name: "系统设置", href: "/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 监听来自header的收起事件
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsCollapsed(prev => !prev)
    }
    
    window.addEventListener('toggleSidebar', handleToggleSidebar)
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar)
    }
  }, [])

  // 点击外部关闭子菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const sidebarElement = document.querySelector('[data-sidebar]')
      const popupElement = document.querySelector('[data-submenu-popup]')
      
      if (activeCategory && 
          sidebarElement && 
          popupElement && 
          !sidebarElement.contains(target) && 
          !popupElement.contains(target)) {
        setActiveCategory(null)
      }
    }

    if (activeCategory) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [activeCategory])

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    setActiveCategory(null)
  }

  const handleCategoryClick = (category: string) => {
    if (isCollapsed) {
      setActiveCategory(activeCategory === category ? null : category)
    } else {
      toggleCategory(category)
    }
  }

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div 
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
        data-sidebar
      >
        <div className={cn(
          "flex items-center h-16 border-b border-sidebar-border",
          isCollapsed ? "px-2 justify-center" : "px-6 justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-sidebar-foreground">智能文档系统</h1>
                <p className="text-xs text-muted-foreground">Knowledge Engine</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
            </Link>
          )}
        </div>

        <ScrollArea
          className={cn(
            "flex-1 sidebar-scroll",
            isCollapsed ? "px-2 py-4" : "px-3 py-4"
          )}
          onWheel={(e) => {
            // 侧边栏滚动事件隔离，避免影响主内容或页面
            e.stopPropagation()
          }}
          onScroll={(e) => {
            e.stopPropagation()
          }}
        >
          <nav className="space-y-1">
            {navigation.map((item, index) => {
              // Single navigation item
              if ("href" in item) {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full text-sm font-medium",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent-hover transition-colors"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                      {!isCollapsed && item.name}
                    </Link>
                  </Button>
                )
              }

              // Category with sub-items
              const isExpanded = expandedCategories.has(item.category)
              return (
                <div key={item.category} className="space-y-1">
                  {!isCollapsed && <Separator className="my-2" />}
                  
                  {/* 大菜单栏 - 可点击展开/收起 */}
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full text-sm font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
                      isCollapsed ? "justify-center px-2" : "justify-between"
                    )}
                    onClick={() => handleCategoryClick(item.category)}
                    aria-expanded={isExpanded}
                  >
                    <div className={cn("flex items-center", isCollapsed && "justify-center")}>
                      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                      {!isCollapsed && <span className="font-semibold">{item.category}</span>}
                    </div>
                    {!isCollapsed && (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4 transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      )
                    )}
                  </Button>

                  {/* 子菜单项 - 展开时显示 */}
                  {!isCollapsed && isExpanded && (
                    <div className="ml-4 space-y-1">
                      {item.items.map((subItem) => {
                        const isActive = pathname === subItem.href
                        return (
                          <Button
                            key={subItem.name}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start text-sm font-medium",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent-hover transition-colors"
                                : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
                            )}
                            asChild
                          >
                            <Link href={subItem.href}>
                              <subItem.icon className="mr-3 h-4 w-4" />
                              {subItem.name}
                            </Link>
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* 遮罩层已移除 */}

      {/* 子菜单弹出层 - 当侧边栏收起时显示（常驻DOM并使用纯CSS过渡） */}
      {isCollapsed && (
        <div 
          role="menu"
          aria-hidden={!activeCategory}
          aria-label="子菜单"
          className={cn(
            "fixed left-16 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg z-20 transition-all duration-300",
            activeCategory ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
          )}
          data-submenu-popup
        >
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border relative">
            <h3 id="submenu-title" className="text-sm font-semibold text-sidebar-foreground">
              {activeCategory && navigation.find(item => !("href" in item) && item.category === activeCategory)?.category}
            </h3>
            {/* 子菜单收起按钮：仅收起当前子菜单，不影响侧边栏状态 */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="收起子菜单"
              className="absolute right-3 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-accent transition-transform duration-200 active:scale-95"
              onClick={() => setActiveCategory(null)}
              title="收起子菜单"
            >
              <PanelLeftClose className="h-3 w-3 transition-transform duration-200" />
            </Button>
          </div>
          <ScrollArea
            aria-labelledby="submenu-title"
            className={cn(
              "flex-1 px-3 py-4 transition-[max-height,opacity] duration-300",
              activeCategory ? "opacity-100 max-h-[calc(100vh-64px)]" : "opacity-0 max-h-0"
            )}
          >
            <div className="space-y-1" role="group" aria-label="子菜单项">
              {activeCategory && navigation.find(item => !("href" in item) && item.category === activeCategory)?.items.map((subItem) => {
                const isActive = pathname === subItem.href
                return (
                  <Button
                    key={subItem.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-sm font-medium",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent-hover transition-colors"
                        : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
                    )}
                    asChild
                  >
                    <Link href={subItem.href}>
                      <subItem.icon className="mr-3 h-4 w-4" />
                      {subItem.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
