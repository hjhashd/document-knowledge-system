"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, AlertTriangle, Download, Eye, Zap, Shield, FileText } from "lucide-react"

interface RiskItem {
  id: string
  type: string
  level: "high" | "medium" | "low"
  confidence: number
  position: { page: number; line: number }
  content: string
  suggestion: string
  category: string
}

export function RiskIdentificationInterface() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [riskItems, setRiskItems] = useState<RiskItem[]>([
    {
      id: "1",
      type: "条款缺失",
      level: "high",
      confidence: 96.5,
      position: { page: 1, line: 15 },
      content: "缺少违约责任条款",
      suggestion: "建议添加明确的违约责任和赔偿标准",
      category: "法律风险",
    },
    {
      id: "2",
      type: "金额异常",
      level: "medium",
      confidence: 89.2,
      position: { page: 2, line: 8 },
      content: "合同金额与市场价格差异较大",
      suggestion: "建议核实金额的合理性",
      category: "商业风险",
    },
    {
      id: "3",
      type: "时间冲突",
      level: "low",
      confidence: 78.3,
      position: { page: 1, line: 22 },
      content: "交付时间与付款时间存在逻辑冲突",
      suggestion: "建议调整时间安排的逻辑顺序",
      category: "执行风险",
    },
  ])

  const handleRiskAnalysis = async () => {
    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case "high":
        return "高风险"
      case "medium":
        return "中风险"
      case "low":
        return "低风险"
      default:
        return "未知"
    }
  }

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            合同上传
          </CardTitle>
          <CardDescription>上传需要进行风险识别的合同文档，系统将自动分析潜在风险点</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">点击上传或拖拽合同文件到此处</p>
            <p className="text-xs text-gray-500 mt-1">支持 PDF, DOC, DOCX 格式，最大 50MB</p>
            <Button className="mt-4">选择文件</Button>
          </div>
        </CardContent>
      </Card>

      {/* 风险分析设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            风险分析设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">合同类型</label>
              <select className="w-full p-2 border rounded-md">
                <option>自动识别</option>
                <option>销售合同</option>
                <option>采购合同</option>
                <option>服务合同</option>
                <option>租赁合同</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">风险等级</label>
              <select className="w-full p-2 border rounded-md">
                <option>全部等级</option>
                <option>仅高风险</option>
                <option>中高风险</option>
                <option>低风险以上</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">分析深度</label>
              <select className="w-full p-2 border rounded-md">
                <option>深度分析（推荐）</option>
                <option>标准分析</option>
                <option>快速分析</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">风险类别</label>
            <div className="flex flex-wrap gap-2">
              {["法律风险", "商业风险", "执行风险", "合规风险", "财务风险"].map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleRiskAnalysis} disabled={isProcessing} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            {isProcessing ? "正在分析..." : "开始风险分析"}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>分析进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 风险分析结果 */}
      {riskItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                风险分析结果
              </span>
              <div className="flex gap-2">
                <Badge variant="destructive">{riskItems.filter((r) => r.level === "high").length} 高风险</Badge>
                <Badge variant="secondary">{riskItems.filter((r) => r.level === "medium").length} 中风险</Badge>
                <Badge variant="outline">{riskItems.filter((r) => r.level === "low").length} 低风险</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">风险列表</TabsTrigger>
                <TabsTrigger value="category">分类视图</TabsTrigger>
                <TabsTrigger value="report">分析报告</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {riskItems.map((risk) => (
                  <Card key={risk.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{risk.type}</h4>
                            <Badge className={getRiskLevelColor(risk.level)}>{getRiskLevelText(risk.level)}</Badge>
                            <Badge variant="outline">{risk.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{risk.content}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>建议：</strong>
                            {risk.suggestion}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              位置: 第{risk.position.page}页 第{risk.position.line}行
                            </span>
                            <span>置信度: {risk.confidence}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          <Button size="sm" variant="outline">
                            修改
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="category" className="space-y-4">
                {["法律风险", "商业风险", "执行风险"].map((category) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {riskItems
                          .filter((r) => r.category === category)
                          .map((risk) => (
                            <div key={risk.id} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{risk.content}</span>
                              <Badge className={getRiskLevelColor(risk.level)}>{getRiskLevelText(risk.level)}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="report">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      风险分析报告
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 border rounded">
                        <div className="text-2xl font-bold text-red-600">
                          {riskItems.filter((r) => r.level === "high").length}
                        </div>
                        <div className="text-sm text-gray-600">高风险项</div>
                      </div>
                      <div className="p-4 border rounded">
                        <div className="text-2xl font-bold text-yellow-600">
                          {riskItems.filter((r) => r.level === "medium").length}
                        </div>
                        <div className="text-sm text-gray-600">中风险项</div>
                      </div>
                      <div className="p-4 border rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {riskItems.filter((r) => r.level === "low").length}
                        </div>
                        <div className="text-sm text-gray-600">低风险项</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">主要风险点：</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>合同条款不完整，缺少关键的违约责任条款</li>
                        <li>金额设置存在异常，需要进一步核实</li>
                        <li>时间安排存在逻辑冲突，可能影响合同执行</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">建议措施：</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        <li>补充完善违约责任和赔偿条款</li>
                        <li>核实合同金额的合理性和准确性</li>
                        <li>调整时间安排，确保逻辑一致性</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 导出选项 */}
      {riskItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              导出风险报告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="w-full bg-transparent">
                导出为 PDF
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                导出为 Word
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                导出为 Excel
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                生成详细报告
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
