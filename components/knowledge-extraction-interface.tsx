"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Brain, FileText, Download, Play, Pause, CheckCircle, AlertCircle, Clock, Database } from "lucide-react"

interface KnowledgeItem {
  id: string
  title: string
  content: string
  type: "concept" | "fact" | "relationship" | "insight"
  confidence: number
  sourceDocument: string
  extractedAt: string
  tags: string[]
}

export function KnowledgeExtractionInterface() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [extractionStatus, setExtractionStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const documents = [
    { id: "1", name: "合同协议_2024.pdf", type: "PDF", size: "2.5 MB" },
    { id: "2", name: "财务报表.xlsx", type: "Excel", size: "1.8 MB" },
    { id: "3", name: "技术文档.docx", type: "Word", size: "3.2 MB" },
  ]

  const mockKnowledgeItems: KnowledgeItem[] = [
    {
      id: "1",
      title: "合同有效期",
      content: "本合同自2024年1月1日起生效，有效期为三年，至2026年12月31日止。",
      type: "fact",
      confidence: 95,
      sourceDocument: "合同协议_2024.pdf",
      extractedAt: "2024-01-15 10:30",
      tags: ["合同", "时间", "有效期"],
    },
    {
      id: "2",
      title: "付款条件",
      content: "乙方应在收到发票后30个工作日内完成付款，逾期按日利率0.05%计算滞纳金。",
      type: "concept",
      confidence: 88,
      sourceDocument: "合同协议_2024.pdf",
      extractedAt: "2024-01-15 10:32",
      tags: ["付款", "条件", "滞纳金"],
    },
    {
      id: "3",
      title: "风险关联分析",
      content: "付款延迟风险与现金流管理直接相关，建议建立预警机制。",
      type: "insight",
      confidence: 76,
      sourceDocument: "财务报表.xlsx",
      extractedAt: "2024-01-15 10:35",
      tags: ["风险", "现金流", "预警"],
    },
  ]

  const typeLabels = {
    all: "全部",
    concept: "概念",
    fact: "事实",
    relationship: "关系",
    insight: "洞察",
  }

  const typeColors = {
    concept: "blue",
    fact: "green",
    relationship: "purple",
    insight: "orange",
  }

  const filteredKnowledgeItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  const handleStartExtraction = async () => {
    if (selectedDocuments.length === 0) return

    setExtractionStatus("running")
    setExtractionProgress(0)
    setKnowledgeItems([])

    // 模拟提取过程
    const interval = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setExtractionStatus("completed")
          setKnowledgeItems(mockKnowledgeItems)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const getStatusIcon = () => {
    switch (extractionStatus) {
      case "running":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">知识提取</h2>
          <p className="text-muted-foreground">从文档中提取关键信息生成知识条目</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出知识库
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 文档选择 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              选择文档
            </CardTitle>
            <CardDescription>选择要提取知识的文档</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDocuments.includes(doc.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => handleDocumentSelect(doc.id)}
                    className="ml-2"
                  />
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-3">
              <Button
                onClick={handleStartExtraction}
                disabled={selectedDocuments.length === 0 || extractionStatus === "running"}
                className="w-full"
              >
                {extractionStatus === "running" ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    提取中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始提取
                  </>
                )}
              </Button>

              {extractionStatus === "running" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>提取进度</span>
                    <span>{extractionProgress}%</span>
                  </div>
                  <Progress value={extractionProgress} />
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getStatusIcon()}
                <span>
                  {extractionStatus === "idle" && "准备就绪"}
                  {extractionStatus === "running" && "正在提取知识..."}
                  {extractionStatus === "completed" && `已提取 ${knowledgeItems.length} 个知识条目`}
                  {extractionStatus === "error" && "提取失败"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 知识条目列表 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                提取的知识条目
              </CardTitle>
              <CardDescription>查看和管理提取的知识内容</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="搜索知识条目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <ScrollArea className="h-96">
                {filteredKnowledgeItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {extractionStatus === "idle" ? "请选择文档并开始提取" : "暂无知识条目"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredKnowledgeItems.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`bg-${typeColors[item.type]}-100 text-${typeColors[item.type]}-800`}
                            >
                              {typeLabels[item.type]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.confidence}%
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{item.content}</p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>来源: {item.sourceDocument}</span>
                          <span>提取时间: {item.extractedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
