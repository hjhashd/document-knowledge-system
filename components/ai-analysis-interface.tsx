"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, FileText, Upload, Download, Eye, BarChart3, Lightbulb, Target } from "lucide-react"

export function AIAnalysisInterface() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [analysisType, setAnalysisType] = useState("comprehensive")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  const mockDocuments = [
    { id: "1", name: "合同协议.pdf", type: "合同", size: "2.3MB", status: "已上传" },
    { id: "2", name: "财务报告.docx", type: "报告", size: "1.8MB", status: "已上传" },
    { id: "3", name: "技术规范.pdf", type: "技术文档", size: "4.1MB", status: "已上传" },
    { id: "4", name: "市场分析.pptx", type: "演示文稿", size: "3.2MB", status: "已上传" },
  ]

  const mockAnalysisResults = {
    summary: "基于4份文档的综合分析，发现了3个关键业务洞察和5个潜在风险点。文档整体质量良好，信息完整度达到92%。",
    keyInsights: [
      { title: "市场机会", content: "新兴市场需求增长35%，建议加大投入", confidence: 0.89 },
      { title: "成本优化", content: "供应链成本可降低15-20%", confidence: 0.76 },
      { title: "技术升级", content: "现有技术架构需要更新以支持扩展", confidence: 0.92 },
    ],
    riskPoints: [
      { level: "高", description: "合同条款存在法律风险", suggestion: "建议法务部门审核" },
      { level: "中", description: "财务数据不一致", suggestion: "需要进一步核实" },
      { level: "低", description: "技术文档版本较旧", suggestion: "更新到最新版本" },
    ],
  }

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* 文档选择区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            文档选择
          </CardTitle>
          <CardDescription>选择需要进行AI分析的文档，支持多文档同时分析</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDocuments.map((doc) => (
              <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      checked={selectedFiles.includes(doc.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFiles([...selectedFiles, doc.id])
                        } else {
                          setSelectedFiles(selectedFiles.filter((id) => id !== doc.id))
                        }
                      }}
                    />
                    <FileText className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{doc.name}</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {doc.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              上传更多文档
            </Button>
            <div className="text-sm text-muted-foreground">已选择 {selectedFiles.length} 个文档</div>
          </div>
        </CardContent>
      </Card>

      {/* 分析配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            分析配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>分析类型</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">综合分析</SelectItem>
                  <SelectItem value="summary">内容总结</SelectItem>
                  <SelectItem value="insights">洞察提取</SelectItem>
                  <SelectItem value="risks">风险识别</SelectItem>
                  <SelectItem value="comparison">对比分析</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>分析深度</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">快速分析</SelectItem>
                  <SelectItem value="standard">标准分析</SelectItem>
                  <SelectItem value="deep">深度分析</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>自定义分析重点</Label>
            <Textarea placeholder="请描述您希望重点关注的内容或问题..." className="min-h-[80px]" />
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={handleStartAnalysis}
              disabled={selectedFiles.length === 0 || isAnalyzing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isAnalyzing ? "分析中..." : "开始分析"}
            </Button>

            {isAnalyzing && (
              <div className="flex items-center gap-2 flex-1 ml-4">
                <Progress value={progress} className="flex-1" />
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 分析结果 */}
      {progress === 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              分析结果
            </CardTitle>
            <CardDescription>基于AI的多文档智能分析结果</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">总结概览</TabsTrigger>
                <TabsTrigger value="insights">关键洞察</TabsTrigger>
                <TabsTrigger value="risks">风险分析</TabsTrigger>
                <TabsTrigger value="export">导出结果</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">内容总结</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{mockAnalysisResults.summary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                {mockAnalysisResults.keyInsights.map((insight, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          {insight.title}
                        </span>
                        <Badge variant="secondary">置信度: {Math.round(insight.confidence * 100)}%</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{insight.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                {mockAnalysisResults.riskPoints.map((risk, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          风险点 {index + 1}
                        </span>
                        <Badge
                          variant={risk.level === "高" ? "destructive" : risk.level === "中" ? "default" : "secondary"}
                        >
                          {risk.level}风险
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground">{risk.description}</p>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">建议措施:</p>
                        <p className="text-sm text-muted-foreground">{risk.suggestion}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    导出PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    导出Word
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    导出Excel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    预览报告
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
