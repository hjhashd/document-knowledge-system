"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Brain,
  Tag,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Phone,
  Mail,
  FileText,
  Download,
  RefreshCw,
  Play,
  Pause,
  Square,
  Settings,
  Eye,
  Layers,
  Zap,
  Clock,
  BarChart3,
  CheckCircle,
  Loader2,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Code,
  TestTube,
  BookOpen,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockExtractionTasks = [
  {
    id: "1",
    name: "长篇合同文档抽取",
    document: "供应商框架协议_500页.pdf",
    status: "processing",
    progress: 67,
    totalPages: 500,
    processedPages: 335,
    currentChunk: 34,
    totalChunks: 50,
    entities: {
      persons: 156,
      organizations: 89,
      locations: 45,
      dates: 234,
      amounts: 78,
    },
    confidence: 0.91,
    processingTime: "2h 15m",
    estimatedRemaining: "45m",
    dolphinResults: {
      tablesExtracted: 67,
      imagesProcessed: 23,
      chartsAnalyzed: 12,
      layoutElements: 1234,
    },
    langExtractConfig: {
      model: "langextract-v3",
      chunkSize: 2000,
      overlap: 200,
      batchSize: 8,
    },
  },
  {
    id: "2",
    name: "财务年报分析",
    document: "2023年度财务报告_完整版.pdf",
    status: "completed",
    progress: 100,
    totalPages: 280,
    processedPages: 280,
    currentChunk: 35,
    totalChunks: 35,
    entities: {
      persons: 45,
      organizations: 234,
      locations: 12,
      dates: 456,
      amounts: 789,
    },
    confidence: 0.94,
    processingTime: "1h 32m",
    dolphinResults: {
      tablesExtracted: 145,
      imagesProcessed: 67,
      chartsAnalyzed: 89,
      layoutElements: 2345,
    },
  },
  {
    id: "3",
    name: "法律条文汇编",
    document: "企业法律法规汇编_1200页.pdf",
    status: "queued",
    progress: 0,
    totalPages: 1200,
    processedPages: 0,
    currentChunk: 0,
    totalChunks: 120,
    entities: {
      persons: 0,
      organizations: 0,
      locations: 0,
      dates: 0,
      amounts: 0,
    },
    confidence: 0,
    estimatedTime: "4h 30m",
  },
]

const mockEntities = [
  {
    type: "PERSON",
    value: "张三",
    confidence: 0.95,
    context: "项目经理张三负责...",
    page: 45,
    chunk: 5,
    position: { x: 120, y: 340 },
    extractionMethod: "langextract",
  },
  {
    type: "ORG",
    value: "ABC科技有限公司",
    confidence: 0.98,
    context: "与ABC科技有限公司签署...",
    page: 12,
    chunk: 2,
    position: { x: 200, y: 150 },
    extractionMethod: "dolphin+langextract",
  },
  {
    type: "LOCATION",
    value: "北京市朝阳区",
    confidence: 0.92,
    context: "办公地址位于北京市朝阳区...",
    page: 23,
    chunk: 3,
    extractionMethod: "langextract",
  },
  {
    type: "DATE",
    value: "2024年3月15日",
    confidence: 0.96,
    context: "合同签署日期为2024年3月15日",
    page: 67,
    chunk: 7,
    extractionMethod: "langextract",
  },
  {
    type: "MONEY",
    value: "500万元",
    confidence: 0.94,
    context: "项目总金额为500万元",
    page: 89,
    chunk: 9,
    extractionMethod: "dolphin+langextract",
  },
]

export function InformationExtractionInterface() {
  const [selectedTask, setSelectedTask] = useState(mockExtractionTasks[0])
  const [extractionTemplate, setExtractionTemplate] = useState("contract")
  const [chunkSize, setChunkSize] = useState([2000])
  const [overlap, setOverlap] = useState([200])
  const [batchSize, setBatchSize] = useState([8])
  const [enableDolphin, setEnableDolphin] = useState(true)
  const [enableParallel, setEnableParallel] = useState(true)
  const [currentView, setCurrentView] = useState("overview")

  const [extractionMode, setExtractionMode] = useState<"automatic" | "custom">("automatic")
  const [customEntityTypes, setCustomEntityTypes] = useState([
    { name: "PERSON", enabled: true, color: "bg-blue-500", confidence: 0.8 },
    { name: "ORG", enabled: true, color: "bg-green-500", confidence: 0.8 },
    { name: "LOCATION", enabled: true, color: "bg-purple-500", confidence: 0.8 },
    { name: "DATE", enabled: true, color: "bg-orange-500", confidence: 0.8 },
    { name: "MONEY", enabled: true, color: "bg-red-500", confidence: 0.8 },
  ])

  const [ruleEditor, setRuleEditor] = useState({
    isOpen: false,
    editingRule: null as any,
    newRule: {
      name: "",
      pattern: "",
      type: "CUSTOM",
      description: "",
      priority: 1,
      multiRound: false,
      contextWindow: 500,
    },
  })

  const [multiRoundConfig, setMultiRoundConfig] = useState({
    enabled: true,
    maxRounds: 3,
    contextOverlap: 300,
    refinementThreshold: 0.7,
    modelConfig: {
      temperature: 0.1,
      maxTokens: 2000,
      topP: 0.9,
    },
  })

  const [extractionStrategies, setExtractionStrategies] = useState([
    {
      id: "regex",
      name: "正则表达式匹配",
      enabled: true,
      priority: 1,
      description: "使用正则表达式进行精确模式匹配",
    },
    {
      id: "semantic",
      name: "语义理解抽取",
      enabled: true,
      priority: 2,
      description: "基于LangExtract的语义理解",
    },
    {
      id: "multiround",
      name: "多轮迭代优化",
      enabled: true,
      priority: 3,
      description: "多轮大模型处理提升准确性",
    },
    {
      id: "context",
      name: "上下文关联分析",
      enabled: false,
      priority: 4,
      description: "分析实体间的上下文关系",
    },
  ])

  const [customRules, setCustomRules] = useState([
    {
      id: 1,
      name: "合同金额",
      pattern: "(?:金额|总价|费用)[:：]?\\s*([\\d,]+(?:\\.\\d+)?)[万千]?元",
      type: "MONEY",
      enabled: true,
      priority: 1,
      multiRound: true,
      contextWindow: 200,
      description: "提取合同中的金额信息",
    },
    {
      id: 2,
      name: "项目期限",
      pattern: "(?:期限|工期|时间)[:：]?\\s*(\\d+)(?:天|个月|年)",
      type: "DURATION",
      enabled: true,
      priority: 2,
      multiRound: false,
      contextWindow: 150,
      description: "提取项目执行期限",
    },
    {
      id: 3,
      name: "联系方式",
      pattern: "(?:电话|手机|联系方式)[:：]?\\s*(1[3-9]\\d{9})",
      type: "PHONE",
      enabled: true,
      priority: 1,
      multiRound: false,
      contextWindow: 100,
      description: "提取联系电话号码",
    },
    {
      id: 4,
      name: "公司名称",
      pattern: "([\\u4e00-\\u9fa5]+(?:有限公司|股份有限公司|集团|公司))",
      type: "ORGANIZATION",
      enabled: true,
      priority: 2,
      multiRound: true,
      contextWindow: 300,
      description: "提取公司或组织名称",
    },
    {
      id: 5,
      name: "日期时间",
      pattern: "(\\d{4}[-年]\\d{1,2}[-月]\\d{1,2}[日]?)",
      type: "DATE",
      enabled: true,
      priority: 1,
      multiRound: false,
      contextWindow: 50,
      description: "提取日期信息",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTask.status === "processing") {
        // Simulate progress updates
        const newProgress = Math.min(selectedTask.progress + Math.random() * 2, 100)
        setSelectedTask((prev) => ({
          ...prev,
          progress: newProgress,
          processedPages: Math.floor((newProgress / 100) * prev.totalPages),
          currentChunk: Math.floor((newProgress / 100) * prev.totalChunks),
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedTask.status])

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "PERSON":
        return Users
      case "ORG":
        return Building
      case "LOCATION":
        return MapPin
      case "DATE":
        return Calendar
      case "MONEY":
        return DollarSign
      case "PHONE":
        return Phone
      case "EMAIL":
        return Mail
      default:
        return Tag
    }
  }

  const getEntityColor = (type: string) => {
    switch (type) {
      case "PERSON":
        return "bg-blue-500"
      case "ORG":
        return "bg-green-500"
      case "LOCATION":
        return "bg-purple-500"
      case "DATE":
        return "bg-orange-500"
      case "MONEY":
        return "bg-red-500"
      case "PHONE":
        return "bg-cyan-500"
      case "EMAIL":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  const RuleEditorDialog = () => (
    <Dialog open={ruleEditor.isOpen} onOpenChange={(open) => setRuleEditor((prev) => ({ ...prev, isOpen: open }))}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ruleEditor.editingRule ? "编辑抽取规则" : "新建抽取规则"}</DialogTitle>
          <DialogDescription>配置自定义的信息抽取规则，支持正则表达式和多轮处理</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">规则名称</Label>
              <Input
                id="rule-name"
                value={ruleEditor.newRule.name}
                onChange={(e) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, name: e.target.value },
                  }))
                }
                placeholder="例如：合同金额"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-type">实体类型</Label>
              <Select
                value={ruleEditor.newRule.type}
                onValueChange={(value) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, type: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONEY">金额</SelectItem>
                  <SelectItem value="DATE">日期</SelectItem>
                  <SelectItem value="PERSON">人名</SelectItem>
                  <SelectItem value="ORGANIZATION">组织</SelectItem>
                  <SelectItem value="LOCATION">地点</SelectItem>
                  <SelectItem value="PHONE">电话</SelectItem>
                  <SelectItem value="EMAIL">邮箱</SelectItem>
                  <SelectItem value="CUSTOM">自定义</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-pattern">正则表达式</Label>
            <div className="space-y-2">
              <Input
                id="rule-pattern"
                value={ruleEditor.newRule.pattern}
                onChange={(e) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, pattern: e.target.value },
                  }))
                }
                placeholder="例如：(?:金额|总价)[:：]?\s*([\d,]+(?:\.\d+)?)[万千]?元"
                className="font-mono text-sm"
              />
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Button variant="outline" size="sm" type="button">
                  <TestTube className="w-3 h-3 mr-1" />
                  测试正则
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <BookOpen className="w-3 h-3 mr-1" />
                  正则帮助
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-description">规则描述</Label>
            <Textarea
              id="rule-description"
              value={ruleEditor.newRule.description}
              onChange={(e) =>
                setRuleEditor((prev) => ({
                  ...prev,
                  newRule: { ...prev.newRule, description: e.target.value },
                }))
              }
              placeholder="描述这个规则的用途和匹配逻辑"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-priority">优先级</Label>
              <Select
                value={ruleEditor.newRule.priority.toString()}
                onValueChange={(value) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, priority: Number.parseInt(value) },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">高 (1)</SelectItem>
                  <SelectItem value="2">中 (2)</SelectItem>
                  <SelectItem value="3">低 (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="context-window">上下文窗口</Label>
              <Input
                id="context-window"
                type="number"
                value={ruleEditor.newRule.contextWindow}
                onChange={(e) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, contextWindow: Number.parseInt(e.target.value) || 0 },
                  }))
                }
                placeholder="字符数"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={ruleEditor.newRule.multiRound}
                onCheckedChange={(checked) =>
                  setRuleEditor((prev) => ({
                    ...prev,
                    newRule: { ...prev.newRule, multiRound: checked },
                  }))
                }
              />
              <Label>多轮处理</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setRuleEditor((prev) => ({ ...prev, isOpen: false }))}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (ruleEditor.editingRule) {
                // Update existing rule
                const updated = customRules.map((rule) =>
                  rule.id === ruleEditor.editingRule.id ? { ...ruleEditor.editingRule, ...ruleEditor.newRule } : rule,
                )
                setCustomRules(updated)
              } else {
                // Add new rule
                const newRule = {
                  ...ruleEditor.newRule,
                  id: Math.max(...customRules.map((r) => r.id)) + 1,
                  enabled: true,
                }
                setCustomRules([...customRules, newRule])
              }
              setRuleEditor((prev) => ({ ...prev, isOpen: false, editingRule: null }))
            }}
          >
            {ruleEditor.editingRule ? "更新规则" : "创建规则"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">智能信息抽取</h1>
          <p className="text-muted-foreground">基于LangExtract + Dolphin的长文档智能处理系统</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            配置
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button size="sm">
            <Brain className="w-4 h-4 mr-2" />
            新建抽取
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">处理中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">已完成</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">队列中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-xs text-muted-foreground">平均准确率</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Task List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">长文档处理任务</CardTitle>
            <CardDescription>实时监控处理进度</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {mockExtractionTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTask.id === task.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{task.name}</span>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "processing"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status === "completed" ? "已完成" : task.status === "processing" ? "处理中" : "队列中"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.document}</p>

                    {task.status === "processing" && (
                      <div className="space-y-2 mb-2">
                        <Progress value={task.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            页面: {task.processedPages}/{task.totalPages}
                          </span>
                          <span>
                            块: {task.currentChunk}/{task.totalChunks}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>已用时: {task.processingTime}</div>
                          {task.estimatedRemaining && <div>预计剩余: {task.estimatedRemaining}</div>}
                        </div>
                      </div>
                    )}

                    {task.status === "queued" && task.estimatedTime && (
                      <div className="text-xs text-muted-foreground mb-2">预计用时: {task.estimatedTime}</div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>实体: {Object.values(task.entities).reduce((a, b) => a + b, 0)}</span>
                      <span>置信度: {(task.confidence * 100).toFixed(0)}%</span>
                    </div>

                    {task.dolphinResults && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Layers className="w-3 h-3" />
                          <span>表格: {task.dolphinResults.tablesExtracted}</span>
                          <span>图像: {task.dolphinResults.imagesProcessed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Enhanced Extraction Results */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">抽取结果详情</CardTitle>
                <CardDescription>LangExtract + Dolphin 协同处理结果</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentView("overview")}>
                  <BarChart3 className="w-4 h-4 mr-1" />
                  概览
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentView("realtime")}>
                  <Zap className="w-4 h-4 mr-1" />
                  实时
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentView("visual")}>
                  <Eye className="w-4 h-4 mr-1" />
                  可视化
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="processing" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="processing">处理状态</TabsTrigger>
                <TabsTrigger value="entities">实体抽取</TabsTrigger>
                <TabsTrigger value="chunks">分块处理</TabsTrigger>
                <TabsTrigger value="config">配置优化</TabsTrigger>
                <TabsTrigger value="export">结果导出</TabsTrigger>
              </TabsList>

              <TabsContent value="processing" className="space-y-4">
                {selectedTask.status === "processing" && (
                  <div className="space-y-4">
                    {/* Real-time processing status */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">实时处理状态</h4>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Pause className="w-4 h-4 mr-1" />
                              暂停
                            </Button>
                            <Button size="sm" variant="outline">
                              <Square className="w-4 h-4 mr-1" />
                              停止
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>总体进度</span>
                                <span>{selectedTask.progress.toFixed(1)}%</span>
                              </div>
                              <Progress value={selectedTask.progress} className="h-3" />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>页面处理</span>
                                <span>
                                  {selectedTask.processedPages}/{selectedTask.totalPages}
                                </span>
                              </div>
                              <Progress
                                value={(selectedTask.processedPages / selectedTask.totalPages) * 100}
                                className="h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>分块处理</span>
                                <span>
                                  {selectedTask.currentChunk}/{selectedTask.totalChunks}
                                </span>
                              </div>
                              <Progress
                                value={(selectedTask.currentChunk / selectedTask.totalChunks) * 100}
                                className="h-2"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">处理速度</span>
                              <span className="text-sm font-medium">2.3 页/分钟</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">已用时间</span>
                              <span className="text-sm font-medium">{selectedTask.processingTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">预计剩余</span>
                              <span className="text-sm font-medium">{selectedTask.estimatedRemaining}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">当前置信度</span>
                              <span className="text-sm font-medium">{(selectedTask.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dolphin + LangExtract processing details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-blue-500" />
                            Dolphin 视觉解析
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>表格提取</span>
                              <span className="font-medium">{selectedTask.dolphinResults?.tablesExtracted || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>图像处理</span>
                              <span className="font-medium">{selectedTask.dolphinResults?.imagesProcessed || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>图表分析</span>
                              <span className="font-medium">{selectedTask.dolphinResults?.chartsAnalyzed || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>布局元素</span>
                              <span className="font-medium">{selectedTask.dolphinResults?.layoutElements || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Brain className="w-4 h-4 mr-2 text-green-500" />
                            LangExtract 语义抽取
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>模型版本</span>
                              <span className="font-medium">
                                {selectedTask.langExtractConfig?.model || "langextract-v3"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>分块大小</span>
                              <span className="font-medium">
                                {selectedTask.langExtractConfig?.chunkSize || 2000} 字符
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>重叠长度</span>
                              <span className="font-medium">{selectedTask.langExtractConfig?.overlap || 200} 字符</span>
                            </div>
                            <div className="flex justify-between">
                              <span>批处理大小</span>
                              <span className="font-medium">{selectedTask.langExtractConfig?.batchSize || 8}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {selectedTask.status === "completed" && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">处理完成</h3>
                        <p className="text-muted-foreground mb-4">
                          成功处理 {selectedTask.totalPages} 页文档，提取{" "}
                          {Object.values(selectedTask.entities).reduce((a, b) => a + b, 0)} 个实体
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">处理时间: </span>
                            <span className="font-medium">{selectedTask.processingTime}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">平均置信度: </span>
                            <span className="font-medium">{(selectedTask.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedTask.status === "queued" && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center py-8">
                        <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">等待处理</h3>
                        <p className="text-muted-foreground mb-4">
                          文档已加入处理队列，预计处理时间: {selectedTask.estimatedTime}
                        </p>
                        <Button>
                          <Play className="w-4 h-4 mr-2" />
                          立即开始处理
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="entities" className="space-y-4">
                {/* Entity Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTask.entities.persons}</p>
                          <p className="text-xs text-muted-foreground">人员</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTask.entities.organizations}</p>
                          <p className="text-xs text-muted-foreground">机构</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTask.entities.locations}</p>
                          <p className="text-xs text-muted-foreground">地点</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTask.entities.dates}</p>
                          <p className="text-xs text-muted-foreground">日期</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{selectedTask.entities.amounts}</p>
                          <p className="text-xs text-muted-foreground">金额</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Entity List with location info */}
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {mockEntities.map((entity, index) => {
                      const IconComponent = getEntityIcon(entity.type)
                      return (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-8 h-8 ${getEntityColor(entity.type)} rounded-lg flex items-center justify-center`}
                                >
                                  <IconComponent className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium">{entity.value}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {entity.type}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {entity.extractionMethod}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{entity.context}</p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>页面: {entity.page}</span>
                                    <span>块: {entity.chunk}</span>
                                    {entity.position && (
                                      <span>
                                        位置: ({entity.position.x}, {entity.position.y})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{(entity.confidence * 100).toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">置信度</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="chunks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">分块处理概览</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">总分块数</span>
                          <span className="text-sm font-medium">{selectedTask.totalChunks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">已处理</span>
                          <span className="text-sm font-medium">{selectedTask.currentChunk}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">平均分块大小</span>
                          <span className="text-sm font-medium">2000 字符</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">重叠长度</span>
                          <span className="text-sm font-medium">200 字符</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">处理性能</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">平均处理时间</span>
                          <span className="text-sm font-medium">2.3 秒/块</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">并行处理数</span>
                          <span className="text-sm font-medium">8 个</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">内存使用</span>
                          <span className="text-sm font-medium">2.1 GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">GPU 利用率</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chunk processing visualization */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4">分块处理进度</h4>
                    <div className="h-[300px] bg-muted/20 rounded-lg p-4">
                      <div className="grid grid-cols-10 gap-1 h-full">
                        {Array.from({ length: selectedTask.totalChunks }, (_, i) => (
                          <div
                            key={i}
                            className={`rounded-sm ${
                              i < selectedTask.currentChunk
                                ? "bg-green-500"
                                : i === selectedTask.currentChunk
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-200"
                            }`}
                            title={`块 ${i + 1}: ${
                              i < selectedTask.currentChunk
                                ? "已完成"
                                : i === selectedTask.currentChunk
                                  ? "处理中"
                                  : "待处理"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-4">抽取模式</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card
                        className={`cursor-pointer transition-all ${
                          extractionMode === "automatic"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => setExtractionMode("automatic")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium">完全自动化</h5>
                              <p className="text-sm text-muted-foreground">使用 LangExtract 自动识别所有实体类型</p>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            • 无需人工干预
                            <br />• 支持多种实体类型
                            <br />• 适合通用文档处理
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${
                          extractionMode === "custom"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => setExtractionMode("custom")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                              <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium">自定义配置</h5>
                              <p className="text-sm text-muted-foreground">人工设置实体类型和抽取规则</p>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            • 精确控制抽取内容
                            <br />• 自定义实体类型
                            <br />• 适合专业领域文档
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {extractionMode === "custom" && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">自定义实体类型</CardTitle>
                        <CardDescription>配置需要抽取的实体类型和置信度阈值</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {customEntityTypes.map((entityType, index) => (
                          <div
                            key={entityType.name}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={entityType.enabled}
                                onCheckedChange={(checked) => {
                                  const updated = [...customEntityTypes]
                                  updated[index].enabled = checked
                                  setCustomEntityTypes(updated)
                                }}
                              />
                              <div className={`w-4 h-4 rounded ${entityType.color}`}></div>
                              <div>
                                <span className="font-medium">{entityType.name}</span>
                                <p className="text-xs text-muted-foreground">
                                  {entityType.name === "PERSON" && "人名、姓名"}
                                  {entityType.name === "ORG" && "组织机构、公司名称"}
                                  {entityType.name === "LOCATION" && "地理位置、地址"}
                                  {entityType.name === "DATE" && "日期、时间"}
                                  {entityType.name === "MONEY" && "金额、货币"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">置信度:</span>
                              <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={entityType.confidence}
                                onChange={(e) => {
                                  const updated = [...customEntityTypes]
                                  updated[index].confidence = Number.parseFloat(e.target.value)
                                  setCustomEntityTypes(updated)
                                }}
                                className="w-20"
                              />
                              <span className="text-xs font-medium w-8">
                                {(entityType.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}

                        <Button variant="outline" className="w-full bg-transparent">
                          <Plus className="w-4 h-4 mr-2" />
                          添加自定义实体类型
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">自定义抽取规则</CardTitle>
                        <CardDescription>使用正则表达式定义特定的抽取模式</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {customRules.map((rule) => (
                          <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(checked) => {
                                  const updated = customRules.map((r) =>
                                    r.id === rule.id ? { ...r, enabled: checked } : r,
                                  )
                                  setCustomRules(updated)
                                }}
                              />
                              <div>
                                <span className="font-medium">{rule.name}</span>
                                <p className="text-xs text-muted-foreground font-mono">{rule.pattern}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{rule.type}</Badge>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button variant="outline" className="w-full bg-transparent">
                          <Plus className="w-4 h-4 mr-2" />
                          添加自定义规则
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      抽取策略配置
                    </CardTitle>
                    <CardDescription>配置不同的信息抽取策略和优先级</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {extractionStrategies.map((strategy) => (
                      <div key={strategy.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={strategy.enabled}
                            onCheckedChange={(checked) => {
                              const updated = extractionStrategies.map((s) =>
                                s.id === strategy.id ? { ...s, enabled: checked } : s,
                              )
                              setExtractionStrategies(updated)
                            }}
                          />
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="text-sm text-muted-foreground">{strategy.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">优先级 {strategy.priority}</Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      多轮处理配置
                    </CardTitle>
                    <CardDescription>配置长文档多轮大模型自动匹配参数</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">启用多轮处理</div>
                        <div className="text-sm text-muted-foreground">对复杂文档进行多轮迭代抽取</div>
                      </div>
                      <Switch
                        checked={multiRoundConfig.enabled}
                        onCheckedChange={(checked) => setMultiRoundConfig((prev) => ({ ...prev, enabled: checked }))}
                      />
                    </div>

                    {multiRoundConfig.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-muted">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>最大轮数</Label>
                            <Select
                              value={multiRoundConfig.maxRounds.toString()}
                              onValueChange={(value) =>
                                setMultiRoundConfig((prev) => ({ ...prev, maxRounds: Number.parseInt(value) }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 轮</SelectItem>
                                <SelectItem value="3">3 轮</SelectItem>
                                <SelectItem value="4">4 轮</SelectItem>
                                <SelectItem value="5">5 轮</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>上下文重叠</Label>
                            <Input
                              type="number"
                              value={multiRoundConfig.contextOverlap}
                              onChange={(e) =>
                                setMultiRoundConfig((prev) => ({
                                  ...prev,
                                  contextOverlap: Number.parseInt(e.target.value) || 0,
                                }))
                              }
                              placeholder="字符数"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>优化阈值</Label>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[multiRoundConfig.refinementThreshold]}
                              onValueChange={([value]) =>
                                setMultiRoundConfig((prev) => ({ ...prev, refinementThreshold: value }))
                              }
                              max={1}
                              min={0.1}
                              step={0.1}
                              className="flex-1"
                            />
                            <span className="text-sm font-mono w-12">
                              {multiRoundConfig.refinementThreshold.toFixed(1)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">当置信度低于此阈值时触发下一轮处理</div>
                        </div>

                        <div className="space-y-3">
                          <Label>模型参数</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Temperature</Label>
                              <Input
                                type="number"
                                value={multiRoundConfig.modelConfig.temperature}
                                onChange={(e) =>
                                  setMultiRoundConfig((prev) => ({
                                    ...prev,
                                    modelConfig: {
                                      ...prev.modelConfig,
                                      temperature: Number.parseFloat(e.target.value) || 0,
                                    },
                                  }))
                                }
                                step={0.1}
                                min={0}
                                max={2}
                                className="text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max Tokens</Label>
                              <Input
                                type="number"
                                value={multiRoundConfig.modelConfig.maxTokens}
                                onChange={(e) =>
                                  setMultiRoundConfig((prev) => ({
                                    ...prev,
                                    modelConfig: {
                                      ...prev.modelConfig,
                                      maxTokens: Number.parseInt(e.target.value) || 0,
                                    },
                                  }))
                                }
                                className="text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Top P</Label>
                              <Input
                                type="number"
                                value={multiRoundConfig.modelConfig.topP}
                                onChange={(e) =>
                                  setMultiRoundConfig((prev) => ({
                                    ...prev,
                                    modelConfig: {
                                      ...prev.modelConfig,
                                      topP: Number.parseFloat(e.target.value) || 0,
                                    },
                                  }))
                                }
                                step={0.1}
                                min={0}
                                max={1}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Code className="w-5 h-5 mr-2" />
                          自定义抽取规则
                        </CardTitle>
                        <CardDescription>使用正则表达式和语义规则定义特定的抽取模式</CardDescription>
                      </div>
                      <Button
                        onClick={() =>
                          setRuleEditor((prev) => ({
                            ...prev,
                            isOpen: true,
                            editingRule: null,
                            newRule: {
                              name: "",
                              pattern: "",
                              type: "CUSTOM",
                              description: "",
                              priority: 1,
                              multiRound: false,
                              contextWindow: 500,
                            },
                          }))
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        新建规则
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {customRules.map((rule) => (
                        <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(checked) => {
                                  const updated = customRules.map((r) =>
                                    r.id === rule.id ? { ...r, enabled: checked } : r,
                                  )
                                  setCustomRules(updated)
                                }}
                              />
                              <div>
                                <div className="font-medium flex items-center space-x-2">
                                  <span>{rule.name}</span>
                                  {rule.multiRound && (
                                    <Badge variant="secondary" className="text-xs">
                                      <RotateCcw className="w-3 h-3 mr-1" />
                                      多轮
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{rule.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{rule.type}</Badge>
                              <Badge variant="outline">P{rule.priority}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setRuleEditor((prev) => ({
                                    ...prev,
                                    isOpen: true,
                                    editingRule: rule,
                                    newRule: { ...rule },
                                  }))
                                }
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = customRules.filter((r) => r.id !== rule.id)
                                  setCustomRules(updated)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">正则表达式:</div>
                            <div className="bg-muted p-2 rounded font-mono text-sm break-all">{rule.pattern}</div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>上下文窗口: {rule.contextWindow} 字符</span>
                            <span>优先级: {rule.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {customRules.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <div>暂无自定义规则</div>
                        <div className="text-sm">点击"新建规则"开始创建</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <RuleEditorDialog />
              </TabsContent>

              {/* Enhanced export tab */}
              <TabsContent value="export" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium">导出格式</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          JSON格式 (结构化数据)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          CSV格式 (表格数据)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          XML格式 (标记数据)
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          Excel格式 (分析报告)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium">导出选项</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">包含置信度分数</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">包含上下文信息</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">包含页面位置</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">包含分块信息</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">包含Dolphin解析结果</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">包含处理元数据</span>
                        </label>
                      </div>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        导出结果
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
