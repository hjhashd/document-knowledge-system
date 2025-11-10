"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Bot, User, Search, BookOpen, Lightbulb, History } from "lucide-react"

export function ResultQAInterface() {
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [selectedContext, setSelectedContext] = useState("all")
  const [isAsking, setIsAsking] = useState(false)

  const conversations = [
    {
      id: "1",
      question: "数字化转型的主要挑战是什么？",
      answer:
        "根据分析结果，数字化转型的主要挑战包括：1）技术能力不足，85%的企业缺乏专业技术人才；2）组织文化阻力，传统企业文化难以适应数字化变革；3）资金投入限制，初期投入成本较高；4）数据安全风险，需要建立完善的安全防护体系。",
      timestamp: "2024-01-15 14:30",
      sources: ["企业转型报告.pdf", "数字化白皮书.docx"],
      confidence: 0.92,
    },
    {
      id: "2",
      question: "AI技术在企业中的应用效果如何？",
      answer:
        "AI技术在企业中的应用效果显著：1）客户服务效率提升40%，通过智能客服系统；2）数据分析准确性提高60%，支持更精准的决策；3）流程自动化节省人力成本30%；4）预测分析帮助企业提前识别市场机会和风险。",
      timestamp: "2024-01-15 14:25",
      sources: ["AI应用案例.pdf"],
      confidence: 0.88,
    },
  ]

  const suggestedQuestions = [
    "风险管理框架的核心要素有哪些？",
    "如何评估数字化转型的投资回报率？",
    "企业在AI应用中需要注意哪些法律风险？",
    "数据安全防护的最佳实践是什么？",
  ]

  const contextOptions = [
    { value: "all", label: "全部结果", description: "基于所有分析结果回答" },
    { value: "extraction", label: "抽取数据", description: "基于信息抽取结果回答" },
    { value: "analysis", label: "分析报告", description: "基于AI分析报告回答" },
    { value: "knowledge", label: "知识库", description: "基于知识库内容回答" },
  ]

  const handleAskQuestion = () => {
    if (!currentQuestion.trim()) return

    setIsAsking(true)
    // 模拟API调用
    setTimeout(() => {
      setIsAsking(false)
      setCurrentQuestion("")
    }, 2000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setCurrentQuestion(question)
  }

  return (
    <div className="space-y-6">
      {/* 问答配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            智能问答
          </CardTitle>
          <CardDescription>基于抽取结果进行多轮问答和信息检索</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>问答范围</Label>
              <Select value={selectedContext} onValueChange={setSelectedContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contextOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>回答模式</Label>
              <Select defaultValue="detailed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">简洁回答</SelectItem>
                  <SelectItem value="detailed">详细回答</SelectItem>
                  <SelectItem value="analytical">分析性回答</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 问答界面 */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                对话历史
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="space-y-3">
                      {/* 用户问题 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{conv.question}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{conv.timestamp}</p>
                        </div>
                      </div>

                      {/* AI回答 */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                            <p className="text-sm leading-relaxed">{conv.answer}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="secondary">置信度: {Math.round(conv.confidence * 100)}%</Badge>
                              <div className="text-xs text-muted-foreground">来源: {conv.sources.join(", ")}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAsking && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                            <p className="text-sm text-muted-foreground">正在思考...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* 输入区域 */}
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="请输入您的问题..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAskQuestion()
                      }
                    }}
                  />
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!currentQuestion.trim() || isAsking}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-4">
          {/* 推荐问题 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                推荐问题
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left h-auto p-3 justify-start bg-transparent"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  <div className="text-sm">{question}</div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                查看知识库
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <History className="h-4 w-4 mr-2" />
                历史对话
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Search className="h-4 w-4 mr-2" />
                高级搜索
              </Button>
            </CardContent>
          </Card>

          {/* 统计信息 */}
          <Card>
            <CardHeader>
              <CardTitle>对话统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">今日问答</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">平均置信度</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">响应时间</span>
                <span className="font-medium">1.2s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
