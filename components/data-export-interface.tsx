"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileText, Table, Code, ImageIcon, Filter } from "lucide-react"

export function DataExportInterface() {
  const [exportFormat, setExportFormat] = useState("excel")
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const dataCategories = [
    {
      id: "documents",
      name: "文档信息",
      description: "文档名称、类型、大小、上传时间等基础信息",
      count: 156,
      icon: FileText,
    },
    {
      id: "extraction",
      name: "抽取数据",
      description: "从文档中提取的结构化信息和实体数据",
      count: 1240,
      icon: Table,
    },
    {
      id: "analysis",
      name: "分析结果",
      description: "AI分析生成的总结、洞察和风险评估",
      count: 89,
      icon: Code,
    },
    {
      id: "knowledge",
      name: "知识条目",
      description: "提取的知识点、问答对和关联关系",
      count: 567,
      icon: ImageIcon,
    },
  ]

  const exportFormats = [
    { value: "excel", label: "Excel (.xlsx)", description: "适合数据分析和表格处理" },
    { value: "csv", label: "CSV (.csv)", description: "通用的数据交换格式" },
    { value: "json", label: "JSON (.json)", description: "结构化数据格式，便于程序处理" },
    { value: "word", label: "Word (.docx)", description: "适合报告和文档编辑" },
    { value: "pdf", label: "PDF (.pdf)", description: "便于阅读和分享的格式" },
    { value: "markdown", label: "Markdown (.md)", description: "轻量级标记语言格式" },
  ]

  const handleExport = () => {
    setIsExporting(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 20
      })
    }, 400)
  }

  const handleDataSelection = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedData([...selectedData, categoryId])
    } else {
      setSelectedData(selectedData.filter((id) => id !== categoryId))
    }
  }

  return (
    <div className="space-y-6">
      {/* 数据选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            数据选择
          </CardTitle>
          <CardDescription>选择需要导出的数据类型和范围</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedData.includes(category.id)}
                        onCheckedChange={(checked) => handleDataSelection(category.id, !!checked)}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <h4 className="font-medium">{category.name}</h4>
                          <Badge variant="secondary">{category.count}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-sm text-muted-foreground">已选择 {selectedData.length} 个数据类型</div>
        </CardContent>
      </Card>

      {/* 导出格式 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            导出格式
          </CardTitle>
          <CardDescription>选择导出文件的格式</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="space-y-3">
            {exportFormats.map((format) => (
              <div key={format.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={format.value} id={format.value} />
                <div className="flex-1">
                  <Label htmlFor={format.value} className="font-medium cursor-pointer">
                    {format.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 导出选项 */}
      <Card>
        <CardHeader>
          <CardTitle>导出选项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="range" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="range">时间范围</TabsTrigger>
              <TabsTrigger value="filter">数据筛选</TabsTrigger>
              <TabsTrigger value="format">格式设置</TabsTrigger>
            </TabsList>

            <TabsContent value="range" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>开始日期</Label>
                  <Select defaultValue="last-month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">最近一周</SelectItem>
                      <SelectItem value="last-month">最近一个月</SelectItem>
                      <SelectItem value="last-quarter">最近三个月</SelectItem>
                      <SelectItem value="last-year">最近一年</SelectItem>
                      <SelectItem value="all">全部时间</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>数据状态</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="processed">已处理</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="error">处理失败</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filter" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>文档类型</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="pdf">PDF文档</SelectItem>
                      <SelectItem value="word">Word文档</SelectItem>
                      <SelectItem value="excel">Excel表格</SelectItem>
                      <SelectItem value="image">图片文件</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>置信度阈值</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">&gt;50%</SelectItem>
                      <SelectItem value="medium">&gt;70%</SelectItem>
                      <SelectItem value="high">&gt;90%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" defaultChecked />
                  <Label htmlFor="include-metadata">包含元数据信息</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-timestamps" defaultChecked />
                  <Label htmlFor="include-timestamps">包含时间戳</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-confidence" />
                  <Label htmlFor="include-confidence">包含置信度分数</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="compress-output" />
                  <Label htmlFor="compress-output">压缩输出文件</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 导出操作 */}
      <Card>
        <CardHeader>
          <CardTitle>导出操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">准备导出</p>
              <p className="text-sm text-muted-foreground">
                将导出 {selectedData.length} 类数据，格式: {exportFormats.find((f) => f.value === exportFormat)?.label}
              </p>
            </div>

            <Button
              onClick={handleExport}
              disabled={selectedData.length === 0 || isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "导出中..." : "开始导出"}
            </Button>
          </div>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>导出进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {progress === 100 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-green-800">导出完成</p>
              </div>
              <p className="text-sm text-green-600 mt-1">文件已生成，点击下载按钮获取文件</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                下载文件
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
