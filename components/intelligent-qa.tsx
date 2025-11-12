"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  FileText,
  Brain,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Settings,
  Zap,
  Target,
  Database,
  Network,
  BarChart3,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: Source[]
  confidence?: number
  processingTime?: number
  feedback?: "positive" | "negative" | null
}

interface Source {
  id: string
  title: string
  type: "document" | "knowledge_graph" | "database"
  excerpt: string
  relevance: number
  page?: number
}

interface QuerySuggestion {
  id: string
  text: string
  category: "document" | "entity" | "relation" | "analysis"
  icon: React.ComponentType<{ className?: string }>
}

const sampleSources: Source[] = [
  {
    id: "1",
    title: "合同协议文档.pdf",
    type: "document",
    excerpt: "根据本协议第三条规定，甲方应在合同签署后30日内完成首期付款...",
    relevance: 0.95,
    page: 3,
  },
  {
    id: "2",
    title: "知识图谱: 张三-ABC公司",
    type: "knowledge_graph",
    excerpt: "张三担任ABC公司技术总监，负责项目管理相关工作...",
    relevance: 0.87,
  },
  {
    id: "3",
    title: "财务数据库",
    type: "database",
    excerpt: "2024年第一季度项目预算为500万元，已执行60%...",
    relevance: 0.78,
  },
]

const querySuggestions: QuerySuggestion[] = [
  { id: "1", text: "合同中的付款条款是什么？", category: "document", icon: FileText },
  { id: "2", text: "张三在公司担任什么职位？", category: "entity", icon: User },
  { id: "3", text: "ABC公司与XYZ集团的合作关系？", category: "relation", icon: Network },
  { id: "4", text: "项目预算执行情况分析", category: "analysis", icon: BarChart3 },
  { id: "5", text: "2024年签署的所有合同", category: "document", icon: FileText },
  { id: "6", text: "技术总监相关的所有信息", category: "entity", icon: Brain },
]

export function IntelligentQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "您好！我是智能文档知识助手。我可以帮您查询文档内容、分析实体关系、回答业务问题。请输入您的问题，我会基于已处理的文档和知识图谱为您提供准确答案。",
      timestamp: new Date(),
      confidence: 1.0,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<"hybrid" | "semantic" | "keyword">("hybrid")
  const [enableRAG, setEnableRAG] = useState(true)
  const [maxSources, setMaxSources] = useState("5")
  const [confidenceThreshold, setConfidenceThreshold] = useState("0.7")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateResponse(inputValue),
        timestamp: new Date(),
        sources: sampleSources,
        confidence: 0.92,
        processingTime: Math.floor(Math.random() * 1500) + 500,
        feedback: null,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 500)
  }

  const generateResponse = (query: string): string => {
    const responses = [
      "根据已处理的文档分析，我找到了以下相关信息：\n\n合同协议中明确规定了付款条款。根据第三条规定，甲方应在合同签署后30日内完成首期付款，金额为合同总额的30%。后续付款将根据项目进度分期执行。\n\n这些信息来源于已解析的PDF文档和相关的知识图谱数据。",
      "基于知识图谱分析，我为您整理了相关实体信息：\n\n张三目前担任ABC公司的技术总监职位，主要负责项目管理相关工作。从文档中提取的信息显示，他在2024年参与了多个重要项目的签署和执行。\n\n相关的实体关系已在知识图谱中建立连接。",
      "通过多模态检索分析，我发现了以下关键信息：\n\n项目预算执行情况良好，2024年第一季度预算为500万元，目前已执行60%。主要支出集中在技术开发和人员成本方面。\n\n这些数据来源于财务数据库和相关文档的结构化抽取。",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSuggestionClick = (suggestion: QuerySuggestion) => {
    setInputValue(suggestion.text)
    inputRef.current?.focus()
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">智能问答系统</h1>
          <p className="text-muted-foreground mt-1">基于RAG的多模态智能问答与知识检索</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
            <Zap className="w-3 h-3 mr-1" />
            RAG 增强
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary-foreground border-primary/20">
            <Target className="w-3 h-3 mr-1" />
            多模态检索
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>对话界面</span>
              </CardTitle>
              <CardDescription>与AI助手进行智能对话，获取精准答案</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.type === "user" ? "bg-primary" : "bg-accent"}>
                          {message.type === "user" ? (
                            <User className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            <Bot className="w-4 h-4 text-accent-foreground" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>

                          {message.type === "assistant" && message.sources && (
                            <div className="mt-3 pt-3 border-t border-border/20">
                              <div className="text-xs font-medium mb-2">参考来源:</div>
                              <div className="space-y-2">
                                {message.sources.map((source) => (
                                  <div key={source.id} className="flex items-start space-x-2 text-xs">
                                    <div className="flex items-center space-x-1">
                                      {source.type === "document" && <FileText className="w-3 h-3" />}
                                      {source.type === "knowledge_graph" && <Network className="w-3 h-3" />}
                                      {source.type === "database" && <Database className="w-3 h-3" />}
                                      <span className="font-medium">{source.title}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(source.relevance * 100)}%
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <>
                                <span>•</span>
                                <span>置信度: {Math.round(message.confidence * 100)}%</span>
                              </>
                            )}
                            {message.processingTime && (
                              <>
                                <span>•</span>
                                <span>{message.processingTime}ms</span>
                              </>
                            )}
                          </div>

                          {message.type === "assistant" && message.id !== "welcome" && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${message.feedback === "positive" ? "text-green-600" : ""}`}
                                onClick={() => handleFeedback(message.id, "positive")}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${message.feedback === "negative" ? "text-red-600" : ""}`}
                                onClick={() => handleFeedback(message.id, "negative")}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent">
                          <Bot className="w-4 h-4 text-accent-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-muted-foreground">AI正在思考中...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      ref={inputRef}
                      placeholder="输入您的问题..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="min-h-[40px]"
                    />
                  </div>
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Query Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">推荐问题</CardTitle>
              <CardDescription>点击快速提问</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {querySuggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <suggestion.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>检索设置</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-mode">检索模式</Label>
                <Select value={searchMode} onValueChange={(value: any) => setSearchMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid">混合检索</SelectItem>
                    <SelectItem value="semantic">语义检索</SelectItem>
                    <SelectItem value="keyword">关键词检索</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enable-rag">启用RAG增强</Label>
                <Switch id="enable-rag" checked={enableRAG} onCheckedChange={setEnableRAG} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-sources">最大来源数</Label>
                <Select value={maxSources} onValueChange={setMaxSources}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3个来源</SelectItem>
                    <SelectItem value="5">5个来源</SelectItem>
                    <SelectItem value="10">10个来源</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">置信度阈值</Label>
                <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5 - 较低</SelectItem>
                    <SelectItem value="0.7">0.7 - 中等</SelectItem>
                    <SelectItem value="0.8">0.8 - 较高</SelectItem>
                    <SelectItem value="0.9">0.9 - 很高</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">会话统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">总问题数:</span>
                  <span>{messages.filter((m) => m.type === "user").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">平均响应时间:</span>
                  <span>1.8秒</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">平均置信度:</span>
                  <span>92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">正面反馈率:</span>
                  <span>95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
