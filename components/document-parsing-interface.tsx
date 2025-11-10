"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  ImageIcon,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Calculator,
  FileImage,
  Grid3X3,
  Type,
  Filter,
  Copy,
  ExternalLink,
} from "lucide-react"

const mockDocuments = [
  {
    id: "1",
    name: "财务报告_2024Q1.pdf",
    type: "PDF",
    status: "completed",
    progress: 100,
    elements: {
      text: 45,
      images: 12,
      tables: 8,
      formulas: 15,
      charts: 3,
      headers: 12,
      paragraphs: 156,
      footnotes: 8,
    },
    confidence: 0.95,
    processingTime: "2.3s",
    pages: 24,
    fileSize: "2.4MB",
  },
  {
    id: "2",
    name: "合同文档_供应商协议.docx",
    type: "DOCX",
    status: "processing",
    progress: 67,
    elements: { text: 23, images: 2, tables: 5, formulas: 0, charts: 0, headers: 5, paragraphs: 80, footnotes: 2 },
    confidence: 0.88,
    processingTime: "1.8s",
    pages: 15,
    fileSize: "1.2MB",
  },
  {
    id: "3",
    name: "技术规格书.xlsx",
    type: "XLSX",
    status: "pending",
    progress: 0,
    elements: { text: 0, images: 0, tables: 0, formulas: 0, charts: 0, headers: 0, paragraphs: 0, footnotes: 0 },
    confidence: 0,
    processingTime: "-",
    pages: 5,
    fileSize: "0.8MB",
  },
]

const mockContentDetails = {
  text: [
    {
      id: "t1",
      type: "heading",
      content: "第一季度财务概览",
      page: 1,
      position: { x: 120, y: 80, width: 300, height: 40 },
      confidence: 0.98,
      fontSize: 18,
      fontWeight: "bold",
      language: "zh-CN",
    },
    {
      id: "t2",
      type: "paragraph",
      content: "本季度公司营收达到1.2亿元，同比增长15.3%，主要得益于核心产品销售的强劲表现...",
      page: 1,
      position: { x: 120, y: 140, width: 450, height: 120 },
      confidence: 0.94,
      fontSize: 12,
      fontWeight: "normal",
      language: "zh-CN",
    },
    {
      id: "t3",
      type: "footnote",
      content: "数据来源：财务部门统计",
      page: 1,
      position: { x: 120, y: 720, width: 200, height: 20 },
      confidence: 0.91,
      fontSize: 10,
      fontWeight: "normal",
      language: "zh-CN",
    },
  ],
  tables: [
    {
      id: "tb1",
      title: "季度收入明细表",
      page: 2,
      position: { x: 80, y: 200, width: 500, height: 300 },
      confidence: 0.96,
      rows: 12,
      columns: 5,
      headers: ["项目", "Q1收入", "Q4收入", "同比增长", "占比"],
      data: [
        ["产品A", "3000万", "2800万", "7.1%", "25%"],
        ["产品B", "4500万", "4200万", "7.1%", "37.5%"],
        ["服务收入", "2700万", "2400万", "12.5%", "22.5%"],
      ],
      hasHeader: true,
      tableType: "financial",
    },
    {
      id: "tb2",
      title: "成本分析表",
      page: 3,
      position: { x: 80, y: 150, width: 480, height: 250 },
      confidence: 0.93,
      rows: 8,
      columns: 4,
      headers: ["成本类型", "金额", "占比", "变化"],
      data: [
        ["人工成本", "2800万", "35%", "+5.2%"],
        ["材料成本", "3200万", "40%", "+8.1%"],
        ["运营成本", "2000万", "25%", "+2.3%"],
      ],
      hasHeader: true,
      tableType: "cost_analysis",
    },
  ],
  formulas: [
    {
      id: "f1",
      content: "ROI = (收益 - 投资) / 投资 × 100%",
      page: 4,
      position: { x: 200, y: 300, width: 250, height: 30 },
      confidence: 0.97,
      type: "mathematical",
      variables: ["ROI", "收益", "投资"],
      complexity: "simple",
    },
    {
      id: "f2",
      content: "∑(i=1 to n) Xi / n = μ",
      page: 5,
      position: { x: 180, y: 400, width: 180, height: 40 },
      confidence: 0.94,
      type: "statistical",
      variables: ["Xi", "n", "μ"],
      complexity: "medium",
    },
    {
      id: "f3",
      content: "NPV = ∑(t=0 to T) CFt / (1+r)^t",
      page: 6,
      position: { x: 150, y: 250, width: 220, height: 35 },
      confidence: 0.92,
      type: "financial",
      variables: ["NPV", "CFt", "r", "t", "T"],
      complexity: "complex",
    },
  ],
  images: [
    {
      id: "i1",
      title: "营收趋势图",
      page: 2,
      position: { x: 100, y: 400, width: 400, height: 250 },
      confidence: 0.95,
      type: "chart",
      format: "PNG",
      resolution: "300dpi",
      colors: ["#3b82f6", "#ef4444", "#10b981"],
      hasText: true,
      description: "显示过去四个季度的营收变化趋势",
    },
    {
      id: "i2",
      title: "组织架构图",
      page: 8,
      position: { x: 80, y: 200, width: 500, height: 350 },
      confidence: 0.91,
      type: "diagram",
      format: "PNG",
      resolution: "300dpi",
      colors: ["#6366f1", "#8b5cf6", "#06b6d4"],
      hasText: true,
      description: "公司组织架构和部门关系图",
    },
    {
      id: "i3",
      title: "产品照片",
      page: 12,
      position: { x: 200, y: 300, width: 300, height: 200 },
      confidence: 0.89,
      type: "photo",
      format: "JPEG",
      resolution: "150dpi",
      colors: ["#f59e0b", "#84cc16", "#ec4899"],
      hasText: false,
      description: "主要产品的实物照片展示",
    },
  ],
}

export function DocumentParsingInterface() {
  const [selectedDoc, setSelectedDoc] = useState(mockDocuments[0])
  const [parsingMode, setParsingMode] = useState("auto")
  const [selectedContentType, setSelectedContentType] = useState("all")
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">文档解析</h1>
          <p className="text-muted-foreground">使用Dolphin视觉解析技术进行多类型内容识别和分类输出</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新队列
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            批量解析
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Queue */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">解析队列</CardTitle>
            <CardDescription>待处理和已完成的文档</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDoc.id === doc.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{doc.name}</span>
                      </div>
                      <Badge
                        variant={
                          doc.status === "completed" ? "default" : doc.status === "processing" ? "secondary" : "outline"
                        }
                      >
                        {doc.status === "completed" ? "已完成" : doc.status === "processing" ? "处理中" : "等待中"}
                      </Badge>
                    </div>
                    {doc.status === "processing" && <Progress value={doc.progress} className="h-2 mb-2" />}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {doc.type} • {doc.pages}页
                      </span>
                      <span>置信度: {(doc.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Parsing Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">解析详情</CardTitle>
            <CardDescription>多类型内容识别和分类输出结果</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="content">内容分类</TabsTrigger>
                <TabsTrigger value="export">导出</TabsTrigger>
                <TabsTrigger value="structure">结构</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Type className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedDoc.elements.text}</p>
                          <p className="text-xs text-muted-foreground">文本块</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Grid3X3 className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedDoc.elements.tables}</p>
                          <p className="text-xs text-muted-foreground">表格</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedDoc.elements.formulas}</p>
                          <p className="text-xs text-muted-foreground">公式</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileImage className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedDoc.elements.images}</p>
                          <p className="text-xs text-muted-foreground">图片</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">文档信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>总页数</span>
                          <span className="font-medium">{selectedDoc.pages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>文件大小</span>
                          <span className="font-medium">{selectedDoc.fileSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>段落数</span>
                          <span className="font-medium">{selectedDoc.elements.paragraphs}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">处理状态</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedDoc.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : selectedDoc.status === "processing" ? (
                          <Clock className="w-5 h-5 text-blue-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        )}
                        <span className="capitalize">
                          {selectedDoc.status === "completed"
                            ? "解析完成"
                            : selectedDoc.status === "processing"
                              ? "正在处理"
                              : "等待处理"}
                        </span>
                      </div>
                      {selectedDoc.status === "processing" && (
                        <Progress value={selectedDoc.progress} className="mt-2" />
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">质量指标</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>整体置信度</span>
                          <span className="font-medium">{(selectedDoc.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>处理时间</span>
                          <span className="font-medium">{selectedDoc.processingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>识别准确率</span>
                          <span className="font-medium">96.8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <Label>内容类型筛选</Label>
                  </div>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部内容</SelectItem>
                      <SelectItem value="text">文本内容</SelectItem>
                      <SelectItem value="tables">表格数据</SelectItem>
                      <SelectItem value="formulas">公式内容</SelectItem>
                      <SelectItem value="images">图片内容</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {/* Text Content */}
                    {(selectedContentType === "all" || selectedContentType === "text") && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Type className="w-4 h-4 mr-2 text-blue-500" />
                          文本内容 ({mockContentDetails.text.length})
                        </h4>
                        <div className="space-y-2">
                          {mockContentDetails.text.map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {item.type === "heading" ? "标题" : item.type === "paragraph" ? "段落" : "脚注"}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      第{item.page}页 • 置信度 {(item.confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="sm">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm mb-2 line-clamp-2">{item.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>
                                    字体: {item.fontSize}px • {item.fontWeight}
                                  </span>
                                  <span>
                                    位置: ({item.position.x}, {item.position.y})
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Table Content */}
                    {(selectedContentType === "all" || selectedContentType === "tables") && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Grid3X3 className="w-4 h-4 mr-2 text-purple-500" />
                          表格数据 ({mockContentDetails.tables.length})
                        </h4>
                        <div className="space-y-2">
                          {mockContentDetails.tables.map((table) => (
                            <Card key={table.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-medium">{table.title}</h5>
                                    <p className="text-sm text-muted-foreground">
                                      第{table.page}页 • {table.rows}行 × {table.columns}列 • 置信度{" "}
                                      {(table.confidence * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                      <tr>
                                        {table.headers.map((header, idx) => (
                                          <th key={idx} className="px-3 py-2 text-left font-medium">
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {table.data.slice(0, 3).map((row, idx) => (
                                        <tr key={idx} className="border-t">
                                          {row.map((cell, cellIdx) => (
                                            <td key={cellIdx} className="px-3 py-2">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {table.data.length > 3 && (
                                    <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                                      还有 {table.data.length - 3} 行数据...
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Formula Content */}
                    {(selectedContentType === "all" || selectedContentType === "formulas") && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Calculator className="w-4 h-4 mr-2 text-green-500" />
                          公式内容 ({mockContentDetails.formulas.length})
                        </h4>
                        <div className="space-y-2">
                          {mockContentDetails.formulas.map((formula) => (
                            <Card key={formula.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {formula.type === "mathematical"
                                        ? "数学"
                                        : formula.type === "statistical"
                                          ? "统计"
                                          : "金融"}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {formula.complexity === "simple"
                                        ? "简单"
                                        : formula.complexity === "medium"
                                          ? "中等"
                                          : "复杂"}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      第{formula.page}页 • 置信度 {(formula.confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="sm">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg font-mono text-sm mb-2">
                                  {formula.content}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>变量: {formula.variables.join(", ")}</span>
                                  <span>
                                    位置: ({formula.position.x}, {formula.position.y})
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Content */}
                    {(selectedContentType === "all" || selectedContentType === "images") && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <FileImage className="w-4 h-4 mr-2 text-orange-500" />
                          图片内容 ({mockContentDetails.images.length})
                        </h4>
                        <div className="space-y-2">
                          {mockContentDetails.images.map((image) => (
                            <Card key={image.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium">{image.title}</h5>
                                    <p className="text-sm text-muted-foreground">
                                      第{image.page}页 •{" "}
                                      {image.type === "chart" ? "图表" : image.type === "diagram" ? "图解" : "照片"} •
                                      置信度 {(image.confidence * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg mb-2">
                                  <div className="w-full h-32 bg-gradient-to-br from-muted to-muted/50 rounded flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                </div>
                                <p className="text-sm mb-2">{image.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                  <div>
                                    <span>格式: {image.format}</span>
                                    <br />
                                    <span>分辨率: {image.resolution}</span>
                                  </div>
                                  <div>
                                    <span>
                                      尺寸: {image.position.width}×{image.position.height}
                                    </span>
                                    <br />
                                    <span>包含文字: {image.hasText ? "是" : "否"}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">分类导出</CardTitle>
                      <CardDescription>按内容类型分别导出</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Type className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">文本内容</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            导出
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Grid3X3 className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">表格数据</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            导出
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Calculator className="w-4 h-4 text-green-500" />
                            <span className="text-sm">公式内容</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            导出
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileImage className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">图片内容</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            导出
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">完整导出</CardTitle>
                      <CardDescription>导出完整的解析结果</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="export-format">导出格式</Label>
                        <Select defaultValue="json">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON (结构化数据)</SelectItem>
                            <SelectItem value="xml">XML (标记语言)</SelectItem>
                            <SelectItem value="markdown">Markdown (文档格式)</SelectItem>
                            <SelectItem value="excel">Excel (表格格式)</SelectItem>
                            <SelectItem value="pdf">PDF (报告格式)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>包含内容</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch defaultChecked />
                            <Label className="text-sm">位置信息</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch defaultChecked />
                            <Label className="text-sm">置信度分数</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch defaultChecked />
                            <Label className="text-sm">元数据</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <Label className="text-sm">原始图片</Label>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        导出完整结果
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4">文档结构树</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded" />
                        <span>文档根节点</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded" />
                          <span>页面 1-5</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded" />
                            <span>标题区域</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded" />
                            <span>内容区域</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded" />
                            <span>表格区域</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="parsing-mode">解析模式</Label>
                        <Select value={parsingMode} onValueChange={setParsingMode}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">自动模式</SelectItem>
                            <SelectItem value="precise">精确模式</SelectItem>
                            <SelectItem value="fast">快速模式</SelectItem>
                            <SelectItem value="custom">自定义模式</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="confidence-threshold">置信度阈值</Label>
                        <Input id="confidence-threshold" type="number" defaultValue="0.8" step="0.1" min="0" max="1" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={showAdvancedSettings} onCheckedChange={setShowAdvancedSettings} />
                        <Label>高级设置</Label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label>内容类型优先级</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">文本识别</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">表格解析</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">公式识别</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">图片分析</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {showAdvancedSettings && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">高级配置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dpi-setting">图像DPI设置</Label>
                          <Input id="dpi-setting" type="number" defaultValue="300" />
                        </div>
                        <div>
                          <Label htmlFor="language-model">语言模型</Label>
                          <Select defaultValue="zh-cn">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zh-cn">中文</SelectItem>
                              <SelectItem value="en">英文</SelectItem>
                              <SelectItem value="auto">自动检测</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="custom-rules">自定义解析规则</Label>
                        <Textarea id="custom-rules" placeholder="输入自定义解析规则（JSON格式）" className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
