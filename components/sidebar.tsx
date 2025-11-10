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
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigation = [
  { name: "仪表板", href: "/", icon: BarChart3 },

  // 底层逻辑部分 - 基础技术能力
  {
    category: "底层逻辑",
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
    items: [
      { name: "文件夹管理", href: "/folders", icon: FolderOpen },
      { name: "标签管理", href: "/tags", icon: Tags },
      { name: "文档编辑", href: "/document-edit", icon: FileText },
      { name: "智能标签", href: "/smart-tags", icon: Sparkles },
    ],
  },

  {
    category: "知识管理",
    items: [
      { name: "知识提取", href: "/knowledge-extraction", icon: Brain },
      { name: "AI文档解读", href: "/ai-analysis", icon: Cpu },
      { name: "知识问答", href: "/qa", icon: MessageSquare },
      { name: "知识分类", href: "/knowledge-classification", icon: Network },
      { name: "内容总结", href: "/content-summary", icon: FileText },
      { name: "结果问答", href: "/result-qa", icon: MessageSquare },
    ],
  },

  {
    category: "合同审查",
    items: [
      { name: "公章抽取", href: "/seal-extraction", icon: Stamp },
      { name: "手写文字提取", href: "/handwriting-extraction", icon: FileText },
      { name: "风险识别", href: "/risk-identification", icon: AlertTriangle },
    ],
  },

  {
    category: "企业应用",
    items: [
      { name: "数据导出", href: "/data-export", icon: Download },
      { name: "数据管理", href: "/data", icon: Database },
      { name: "系统设置", href: "/settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-foreground">智能文档系统</h1>
            <p className="text-xs text-muted-foreground">Knowledge Engine</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
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
                    "w-full justify-start text-sm font-medium",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            }

            // Category with sub-items
            return (
              <div key={item.category} className="space-y-1">
                <Separator className="my-2" />
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.category}
                  </h3>
                </div>
                {item.items.map((subItem) => {
                  const isActive = pathname === subItem.href
                  return (
                    <Button
                      key={subItem.name}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-sm font-medium ml-2",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
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
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
