"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Tags, FileText, Play, Pause, CheckCircle, Clock, Download, Settings } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  currentTags: string[]
  suggestedTags: string[]
  confidence: number
  processed: boolean
}

interface TagSuggestion {
  tag: string
  confidence: number
  reason: string
  category: string
}

export function SmartTagsInterface() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "合同协议_2024.pdf",
      type: "PDF",
      size: "2.5 MB",
      currentTags: ["合同"],
      suggestedTags: ["法律文件", "2024年", "协议", "商务"],
      confidence: 92,
      processed: true,
    },
    {
      id: "2",
      name: "财务报表.xlsx",
      type: "Excel",
      size: "1.8 MB",
      currentTags: ["财务"],
      suggestedTags: ["报表", "数据分析", "月度", "统计"],
      confidence: 88,
      processed: true,
    },
    {
      id: "3",
      name: "技术文档.docx",
      type: "Word",
      size: "3.2 MB",
      currentTags: [],
      suggestedTags: ["技术", "文档", "开发", "API"],
      confidence: 0,
      processed: false,
    },
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [autoTagging, setAutoTagging] = useState(true)
  const [minConfidence, setMinConfidence] = useState(75)

  const tagCategories = [
    { name: "文档类型", tags: ["合同", "报表", "技术文档", "法律文件"] },
    { name: "时间", tags: ["2024年", "月度", "年度", "季度"] },
    { name: "业务", tags: ["商务", "财务", "技术", "法律"] },
    { name: "状态", tags: ["草稿", "已审核", "待处理", "完成"] },
  ]

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleProcessDocument = async (docId: string) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    // 模拟AI处理过程
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          // 更新文档状态
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === docId
                ? {
                    ...doc,
                    processed: true,
                    confidence: 85 + Math.random() * 10,
                    suggestedTags: ["AI生成", "智能标签", "自动分类", "内容分析"],
                  }
                : doc,
            ),
          )
          return 100
        }
        return prev + 20
      })
    }, 500)
  }

  const handleProcessAllDocuments = async () => {
    const unprocessedDocs = documents.filter((doc) => !doc.processed)

    for (const doc of unprocessedDocs) {
      await handleProcessDocument(doc.id)
    }
  }

  const handleApplyTag = (docId: string, tag: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              currentTags: [...doc.currentTags, tag],
              suggestedTags: doc.suggestedTags.filter((t) => t !== tag),
            }
          : doc,
      ),
    )
  }

  const handleRemoveTag = (docId: string, tag: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              currentTags: doc.currentTags.filter((t) => t !== tag),
            }
          : doc,
      ),
    )
  }

  const handleApplyAllSuggestions = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              currentTags: [...doc.currentTags, ...doc.suggestedTags],
              suggestedTags: [],
            }
          : doc,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">智能标签</h2>
          <p className="text-muted-foreground">基于文档内容自动生成相关标签</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleProcessAllDocuments} disabled={isProcessing}>
            <Sparkles className="w-4 h-4 mr-2" />
            批量处理
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出标签
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">文档标签</TabsTrigger>
          <TabsTrigger value="categories">标签分类</TabsTrigger>
          <TabsTrigger value="settings">智能配置</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 文档列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  文档列表
                </CardTitle>
                <CardDescription>选择文档查看和编辑标签</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="搜索文档..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDoc?.id === doc.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          {doc.processed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-500" />
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground mb-2">
                          {doc.type} • {doc.size}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {doc.currentTags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.currentTags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.currentTags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {doc.processed && doc.confidence > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">
                              置信度: {Math.round(doc.confidence)}%
                            </div>
                            <Progress value={doc.confidence} className="h-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 标签编辑 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="w-5 h-5" />
                    标签编辑
                  </CardTitle>
                  <CardDescription>管理文档标签和AI建议</CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedDoc ? (
                    <div className="text-center text-muted-foreground py-8">请选择文档查看标签信息</div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">{selectedDoc.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {selectedDoc.type} • {selectedDoc.size}
                        </div>
                      </div>

                      {!selectedDoc.processed && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">AI标签分析</span>
                            <Button
                              size="sm"
                              onClick={() => handleProcessDocument(selectedDoc.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  处理中...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  开始分析
                                </>
                              )}
                            </Button>
                          </div>

                          {isProcessing && (
                            <div className="space-y-2">
                              <Progress value={processingProgress} />
                              <div className="text-xs text-muted-foreground text-center">
                                正在分析文档内容... {processingProgress}%
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>当前标签</Label>
                            <span className="text-sm text-muted-foreground">
                              {selectedDoc.currentTags.length} 个标签
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedDoc.currentTags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(selectedDoc.id, tag)}
                                  className="ml-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                            {selectedDoc.currentTags.length === 0 && (
                              <span className="text-sm text-muted-foreground">暂无标签</span>
                            )}
                          </div>
                        </div>

                        {selectedDoc.suggestedTags.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                AI建议标签
                              </Label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplyAllSuggestions(selectedDoc.id)}
                              >
                                全部应用
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedDoc.suggestedTags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary/10"
                                  onClick={() => handleApplyTag(selectedDoc.id, tag)}
                                >
                                  + {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tagCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.tags.length} 个标签</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                智能标签配置
              </CardTitle>
              <CardDescription>配置AI标签生成的参数和规则</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>自动标签生成</Label>
                  <p className="text-sm text-muted-foreground">上传文档时自动生成标签</p>
                </div>
                <Switch checked={autoTagging} onCheckedChange={setAutoTagging} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>最小置信度阈值</Label>
                <div className="px-3">
                  <Progress value={minConfidence} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>{minConfidence}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">只显示置信度高于此阈值的标签建议</p>
              </div>

              <div className="space-y-4">
                <Label>标签生成策略</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="content-analysis" defaultChecked />
                    <Label htmlFor="content-analysis">内容语义分析</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="keyword-extraction" defaultChecked />
                    <Label htmlFor="keyword-extraction">关键词提取</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="entity-recognition" />
                    <Label htmlFor="entity-recognition">实体识别</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="topic-modeling" />
                    <Label htmlFor="topic-modeling">主题建模</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>最大标签数量</Label>
                <Input type="number" defaultValue="10" min="1" max="50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
