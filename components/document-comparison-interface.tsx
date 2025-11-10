"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitCompare, FileText, Plus, Minus, Edit, ArrowRight, Download, RefreshCw, Eye } from "lucide-react"

const mockComparisons = [
  {
    id: "1",
    name: "合同版本对比",
    docA: "合同_v1.0.pdf",
    docB: "合同_v2.0.pdf",
    status: "completed",
    similarity: 0.87,
    changes: {
      additions: 15,
      deletions: 8,
      modifications: 12,
    },
    createdAt: "2024-03-15 14:30",
  },
  {
    id: "2",
    name: "政策文件对比",
    docA: "政策_2023.docx",
    docB: "政策_2024.docx",
    status: "processing",
    similarity: 0.0,
    changes: {
      additions: 0,
      deletions: 0,
      modifications: 0,
    },
    createdAt: "2024-03-15 15:45",
  },
]

const mockChanges = [
  {
    type: "addition",
    content: "新增条款：乙方应在合同签署后30日内提供相关资质证明文件。",
    location: "第3章 第2节",
    confidence: 0.95,
  },
  {
    type: "deletion",
    content: "删除条款：原第4条关于违约金的计算方式。",
    location: "第4章 第1节",
    confidence: 0.98,
  },
  {
    type: "modification",
    content: "修改：项目完成期限从90天调整为120天。",
    location: "第2章 第3节",
    confidence: 0.92,
  },
  {
    type: "addition",
    content: "新增：增加了知识产权保护相关条款。",
    location: "第5章 新增",
    confidence: 0.89,
  },
]

const mockDetailedContent = {
  docA: {
    sections: [
      {
        title: "第一章 总则",
        content: [
          {
            id: "1.1",
            text: "为了规范双方合作关系，明确各自权利义务，根据《中华人民共和国合同法》及相关法律法规，经双方友好协商，特订立本合同。",
            status: "unchanged",
          },
          {
            id: "1.2",
            text: "项目完成期限为90天，自合同签署之日起计算。",
            status: "modified",
            highlight: true,
          },
          {
            id: "1.3",
            text: "本合同自双方签字盖章之日起生效，有效期至项目完成并验收合格为止。",
            status: "unchanged",
          },
          {
            id: "1.4",
            text: "合同履行过程中如发生争议，双方应友好协商解决；协商不成的，提交合同签署地人民法院管辖。",
            status: "unchanged",
          },
        ],
      },
      {
        title: "第二章 合作内容",
        content: [
          {
            id: "2.1",
            text: "乙方负责提供技术开发服务，包括但不限于系统设计、编码实现、测试部署等工作。",
            status: "unchanged",
          },
          {
            id: "2.2",
            text: "甲方负责提供必要的技术资料、业务需求说明，并配合乙方完成项目开发工作。",
            status: "unchanged",
          },
          {
            id: "2.3",
            text: "项目交付物包括：完整的源代码、技术文档、用户手册、部署说明等。",
            status: "unchanged",
          },
        ],
      },
      {
        title: "第三章 费用与支付",
        content: [
          {
            id: "3.1",
            text: "项目总费用为人民币50万元整（￥500,000.00）。",
            status: "unchanged",
          },
          {
            id: "3.2",
            text: "付款方式：合同签署后支付30%，项目完成50%时支付40%，验收合格后支付剩余30%。",
            status: "unchanged",
          },
        ],
      },
    ],
  },
  docB: {
    sections: [
      {
        title: "第一章 总则",
        content: [
          {
            id: "1.1",
            text: "为了规范双方合作关系，明确各自权利义务，根据《中华人民共和国合同法》及相关法律法规，经双方友好协商，特订立本合同。",
            status: "unchanged",
          },
          {
            id: "1.2",
            text: "项目完成期限为120天，自合同签署之日起计算。如遇不可抗力因素，期限可适当延长。",
            status: "modified",
            highlight: true,
          },
          {
            id: "1.3",
            text: "本合同自双方签字盖章之日起生效，有效期至项目完成并验收合格为止。",
            status: "unchanged",
          },
          {
            id: "1.4",
            text: "乙方应在合同签署后30日内提供相关资质证明文件，包括营业执照、技术资质等。",
            status: "added",
            highlight: true,
          },
          {
            id: "1.5",
            text: "合同履行过程中如发生争议，双方应友好协商解决；协商不成的，提交合同签署地人民法院管辖。",
            status: "unchanged",
          },
        ],
      },
      {
        title: "第二章 合作内容",
        content: [
          {
            id: "2.1",
            text: "乙方负责提供技术开发服务，包括但不限于系统设计、编码实现、测试部署、运维支持等工作。",
            status: "modified",
            highlight: true,
          },
          {
            id: "2.2",
            text: "甲方负责提供必要的技术资料、业务需求说明，并配合乙方完成项目开发工作。",
            status: "unchanged",
          },
          {
            id: "2.3",
            text: "项目交付物包括：完整的源代码、技术文档、用户手册、部署说明、培训材料等。",
            status: "modified",
            highlight: true,
          },
        ],
      },
      {
        title: "第三章 费用与支付",
        content: [
          {
            id: "3.1",
            text: "项目总费用为人民币60万元整（￥600,000.00）。",
            status: "modified",
            highlight: true,
          },
          {
            id: "3.2",
            text: "付款方式：合同签署后支付30%，项目完成50%时支付40%，验收合格后支付剩余30%。",
            status: "unchanged",
          },
        ],
      },
      {
        title: "第四章 知识产权",
        content: [
          {
            id: "4.1",
            text: "项目开发过程中产生的知识产权归甲方所有，乙方不得擅自使用或转让。",
            status: "added",
            highlight: true,
          },
          {
            id: "4.2",
            text: "乙方保证所提供的技术方案不侵犯第三方知识产权，如有侵权由乙方承担全部责任。",
            status: "added",
            highlight: true,
          },
        ],
      },
    ],
  },
}

export function DocumentComparisonInterface() {
  const [selectedComparison, setSelectedComparison] = useState(mockComparisons[0])
  const [comparisonMode, setComparisonMode] = useState("semantic")

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "addition":
        return Plus
      case "deletion":
        return Minus
      case "modification":
        return Edit
      default:
        return FileText
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case "addition":
        return "text-green-600 bg-green-50 border-green-200"
      case "deletion":
        return "text-red-600 bg-red-50 border-red-200"
      case "modification":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">文档对比</h1>
          <p className="text-muted-foreground">智能文档版本对比和变更分析</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新对比
          </Button>
          <Button size="sm">
            <GitCompare className="w-4 h-4 mr-2" />
            新建对比
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Comparison List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">对比任务</CardTitle>
            <CardDescription>历史对比记录</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockComparisons.map((comparison) => (
                  <div
                    key={comparison.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedComparison.id === comparison.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedComparison(comparison)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{comparison.name}</span>
                      <Badge variant={comparison.status === "completed" ? "default" : "secondary"}>
                        {comparison.status === "completed" ? "已完成" : "处理中"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        <span className="truncate">{comparison.docA}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowRight className="w-3 h-3 mr-1" />
                        <span className="truncate">{comparison.docB}</span>
                      </div>
                    </div>
                    {comparison.status === "completed" && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex justify-between text-xs">
                          <span>相似度: {(comparison.similarity * 100).toFixed(0)}%</span>
                          <span>变更: {Object.values(comparison.changes).reduce((a, b) => a + b, 0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">对比结果</CardTitle>
            <CardDescription>详细的文档变更分析</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="changes">变更</TabsTrigger>
                <TabsTrigger value="sidebyside">并排对比</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Comparison Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <GitCompare className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{(selectedComparison.similarity * 100).toFixed(0)}%</p>
                          <p className="text-xs text-muted-foreground">相似度</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedComparison.changes.additions}</p>
                          <p className="text-xs text-muted-foreground">新增</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Minus className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedComparison.changes.deletions}</p>
                          <p className="text-xs text-muted-foreground">删除</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Edit className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedComparison.changes.modifications}</p>
                          <p className="text-xs text-muted-foreground">修改</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        源文档
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedComparison.docA}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          预览
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        目标文档
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedComparison.docB}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          预览
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="changes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">变更详情</h4>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="addition">新增</SelectItem>
                      <SelectItem value="deletion">删除</SelectItem>
                      <SelectItem value="modification">修改</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {mockChanges.map((change, index) => {
                      const IconComponent = getChangeIcon(change.type)
                      return (
                        <Card key={index} className={`border ${getChangeColor(change.type)}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {change.type === "addition" ? "新增" : change.type === "deletion" ? "删除" : "修改"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    置信度: {(change.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-sm mb-2">{change.content}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span>位置: {change.location}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="sidebyside" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">并排对比</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出对比报告
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">显示全部</SelectItem>
                        <SelectItem value="changes">仅显示变更</SelectItem>
                        <SelectItem value="additions">仅显示新增</SelectItem>
                        <SelectItem value="modifications">仅显示修改</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
                  <Card>
                    <CardHeader className="pb-3 bg-muted/30">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {selectedComparison.docA}
                        <Badge variant="outline" className="ml-2">
                          原版本
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[520px]">
                        <div className="p-4 space-y-6">
                          {mockDetailedContent.docA.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-3">
                              <h3 className="font-semibold text-lg border-b pb-2 text-primary">{section.title}</h3>
                              {section.content.map((item, itemIndex) => (
                                <div
                                  key={item.id}
                                  className={`p-3 rounded-lg text-sm leading-relaxed ${
                                    item.status === "modified"
                                      ? "bg-red-50 border-l-4 border-red-400"
                                      : item.status === "deleted"
                                        ? "bg-red-100 border-l-4 border-red-500 line-through opacity-70"
                                        : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">{item.id}</span>
                                    {item.status === "modified" && (
                                      <Badge variant="destructive" className="text-xs">
                                        已修改
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-foreground">{item.text}</p>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3 bg-muted/30">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {selectedComparison.docB}
                        <Badge variant="outline" className="ml-2">
                          新版本
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[520px]">
                        <div className="p-4 space-y-6">
                          {mockDetailedContent.docB.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-3">
                              <h3 className="font-semibold text-lg border-b pb-2 text-primary">
                                {section.title}
                                {section.title === "第四章 知识产权" && (
                                  <Badge variant="default" className="ml-2 text-xs">
                                    新增章节
                                  </Badge>
                                )}
                              </h3>
                              {section.content.map((item, itemIndex) => (
                                <div
                                  key={item.id}
                                  className={`p-3 rounded-lg text-sm leading-relaxed ${
                                    item.status === "added"
                                      ? "bg-green-50 border-l-4 border-green-400"
                                      : item.status === "modified"
                                        ? "bg-blue-50 border-l-4 border-blue-400"
                                        : "bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">{item.id}</span>
                                    {item.status === "added" && (
                                      <Badge variant="default" className="text-xs bg-green-500">
                                        新增
                                      </Badge>
                                    )}
                                    {item.status === "modified" && (
                                      <Badge variant="default" className="text-xs bg-blue-500">
                                        修改
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-foreground">{item.text}</p>
                                  {item.status === "modified" && (
                                    <div className="mt-2 pt-2 border-t border-muted">
                                      <p className="text-xs text-muted-foreground">
                                        <strong>变更说明:</strong>
                                        {item.id === "1.2" && " 期限从90天延长至120天，增加不可抗力条款"}
                                        {item.id === "2.1" && " 增加运维支持服务内容"}
                                        {item.id === "2.3" && " 新增培训材料交付要求"}
                                        {item.id === "3.1" && " 项目费用从50万调整为60万"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Comparison Statistics Summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-green-600">2</p>
                        <p className="text-xs text-muted-foreground">新增章节</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-blue-600">5</p>
                        <p className="text-xs text-muted-foreground">修改条款</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-orange-600">12</p>
                        <p className="text-xs text-muted-foreground">总变更数</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-purple-600">87%</p>
                        <p className="text-xs text-muted-foreground">内容相似度</p>
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
                        <label className="text-sm font-medium">对比模式</label>
                        <Select value={comparisonMode} onValueChange={setComparisonMode}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="semantic">语义对比</SelectItem>
                            <SelectItem value="structural">结构对比</SelectItem>
                            <SelectItem value="textual">文本对比</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">忽略格式差异</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">检测语义相似性</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">显示置信度</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium">敏感度阈值</label>
                        <input type="range" min="0" max="100" defaultValue="80" className="w-full mt-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>低</span>
                          <span>高</span>
                        </div>
                      </div>
                      <Button className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        重新对比
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
