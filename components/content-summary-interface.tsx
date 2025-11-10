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
import { Slider } from "@/components/ui/slider"
import { FileText, Sparkles, Download, Copy, RefreshCw, BookOpen, Clock } from "lucide-react"

export function ContentSummaryInterface() {
  const [summaryLength, setSummaryLength] = useState([300])
  const [summaryStyle, setSummaryStyle] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const mockDocument = {
    name: "企业数字化转型报告.pdf",
    pages: 45,
    words: 12500,
    type: "研究报告",
  }

  const mockSummaries = {
    brief:
      "本报告分析了企业数字化转型的现状、挑战和机遇。研究发现，85%的企业已启动数字化转型，但仅有32%取得显著成效。主要障碍包括技术能力不足、组织文化阻力和资金投入限制。",
    detailed:
      "本报告深入分析了当前企业数字化转型的整体态势。通过对500家企业的调研，发现数字化转型已成为企业发展的必然趋势。报告指出，成功的数字化转型需要从战略规划、技术架构、人才培养、文化变革四个维度协同推进。在技术层面，云计算、大数据、人工智能等新兴技术的应用是关键；在组织层面，需要建立敏捷的组织架构和创新文化；在人才层面，数字化人才的培养和引进至关重要。",
    executive:
      "【执行摘要】企业数字化转型已进入深水区，成功率有待提升。建议：1）制定清晰的数字化战略；2）加大技术投入和人才培养；3）推动组织文化变革；4）建立数字化治理体系。预计未来3年，数字化转型将为企业带来平均15-25%的效率提升。",
  }

  const handleGenerateSummary = () => {
    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 15
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      {/* 文档信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            文档信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">文档名称</Label>
              <p className="font-medium">{mockDocument.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">页数</Label>
              <p className="font-medium">{mockDocument.pages} 页</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">字数</Label>
              <p className="font-medium">{mockDocument.words.toLocaleString()} 字</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">文档类型</Label>
              <Badge variant="secondary">{mockDocument.type}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 总结配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            总结配置
          </CardTitle>
          <CardDescription>配置AI总结的参数和风格</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>总结风格</Label>
                <Select value={summaryStyle} onValueChange={setSummaryStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">专业报告</SelectItem>
                    <SelectItem value="executive">执行摘要</SelectItem>
                    <SelectItem value="academic">学术论文</SelectItem>
                    <SelectItem value="casual">通俗易懂</SelectItem>
                    <SelectItem value="bullet">要点列表</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>总结语言</Label>
                <Select defaultValue="chinese">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chinese">中文</SelectItem>
                    <SelectItem value="english">英文</SelectItem>
                    <SelectItem value="bilingual">中英双语</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>总结长度: {summaryLength[0]} 字</Label>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>简短</span>
                  <span>详细</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>重点关注</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全文总结</SelectItem>
                    <SelectItem value="conclusions">结论要点</SelectItem>
                    <SelectItem value="methodology">方法论</SelectItem>
                    <SelectItem value="data">数据分析</SelectItem>
                    <SelectItem value="recommendations">建议措施</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>自定义要求</Label>
            <Textarea
              placeholder="请描述您对总结的特殊要求，如重点关注的内容、避免的内容等..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={handleGenerateSummary} disabled={isGenerating} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "生成中..." : "生成总结"}
            </Button>

            {isGenerating && (
              <div className="flex items-center gap-2 flex-1 ml-4">
                <Progress value={progress} className="flex-1" />
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 总结结果 */}
      {progress === 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              总结结果
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              生成时间: {new Date().toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="brief" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="brief">简要总结</TabsTrigger>
                <TabsTrigger value="detailed">详细总结</TabsTrigger>
                <TabsTrigger value="executive">执行摘要</TabsTrigger>
              </TabsList>

              <TabsContent value="brief" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">简要版本 · 约150字</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{mockSummaries.brief}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">详细版本 · 约400字</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{mockSummaries.detailed}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="executive" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">执行摘要 · 约200字</Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {mockSummaries.executive}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                导出Word
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                导出PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                导出Markdown
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
