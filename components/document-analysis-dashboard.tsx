"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  FileText,
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Tag,
  Network,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react"

// Sample data for charts
const documentTypeData = [
  { name: "PDF文档", value: 45, count: 1247 },
  { name: "Word文档", value: 25, count: 692 },
  { name: "图像文档", value: 15, count: 415 },
  { name: "Excel表格", value: 10, count: 276 },
  { name: "其他格式", value: 5, count: 138 },
]

const processingTrendData = [
  { date: "2024-01", processed: 1200, entities: 15400, relations: 8900 },
  { date: "2024-02", processed: 1450, entities: 18200, relations: 10500 },
  { date: "2024-03", processed: 1680, entities: 21300, relations: 12800 },
  { date: "2024-04", processed: 1920, entities: 24600, relations: 14200 },
  { date: "2024-05", processed: 2150, entities: 27800, relations: 16100 },
  { date: "2024-06", processed: 2380, entities: 31200, relations: 18500 },
]

const qualityMetricsData = [
  { metric: "解析准确率", value: 96.5, target: 95, status: "good" },
  { metric: "实体识别精度", value: 94.2, target: 90, status: "good" },
  { metric: "关系抽取准确率", value: 89.7, target: 85, status: "good" },
  { metric: "文档完整性", value: 98.1, target: 95, status: "excellent" },
  { metric: "处理速度", value: 87.3, target: 80, status: "good" },
  { metric: "系统可用性", value: 99.2, target: 99, status: "excellent" },
]

const entityTypeDistribution = [
  { type: "人员", count: 3247, percentage: 28.5, color: "#be123c" },
  { type: "机构", count: 2891, percentage: 25.4, color: "#ec4899" },
  { type: "地点", count: 1876, percentage: 16.5, color: "#f59e0b" },
  { type: "日期", count: 1654, percentage: 14.5, color: "#6366f1" },
  { type: "概念", count: 1098, percentage: 9.6, color: "#8b5cf6" },
  { type: "其他", count: 612, percentage: 5.5, color: "#10b981" },
]

const recentDocuments = [
  {
    id: "1",
    name: "技术合作协议.pdf",
    type: "合同",
    size: "2.4 MB",
    processed: "2024-06-15 14:30",
    entities: 47,
    relations: 23,
    quality: 96.8,
    status: "completed",
  },
  {
    id: "2",
    name: "财务报告Q2.xlsx",
    type: "报告",
    size: "1.8 MB",
    processed: "2024-06-15 13:45",
    entities: 32,
    relations: 18,
    quality: 94.2,
    status: "completed",
  },
  {
    id: "3",
    name: "项目计划书.docx",
    type: "计划",
    size: "3.1 MB",
    processed: "2024-06-15 12:20",
    entities: 58,
    relations: 31,
    quality: 97.5,
    status: "completed",
  },
  {
    id: "4",
    name: "会议纪要.pdf",
    type: "记录",
    size: "0.9 MB",
    processed: "2024-06-15 11:15",
    entities: 24,
    relations: 12,
    quality: 93.7,
    status: "processing",
  },
  {
    id: "5",
    name: "产品规格书.pdf",
    type: "规范",
    size: "4.2 MB",
    processed: "2024-06-15 10:30",
    entities: 71,
    relations: 42,
    quality: 98.1,
    status: "completed",
  },
]

const COLORS = ["#be123c", "#ec4899", "#f59e0b", "#6366f1", "#8b5cf6", "#10b981"]

export function DocumentAnalysisDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("6months")
  const [selectedDocumentType, setSelectedDocumentType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 95) return "text-green-600"
    if (quality >= 90) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredDocuments = recentDocuments.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">文档分析仪表板</h1>
          <p className="text-muted-foreground mt-1">深度分析文档处理质量、实体抽取效果和系统性能指标</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">近1个月</SelectItem>
              <SelectItem value="3months">近3个月</SelectItem>
              <SelectItem value="6months">近6个月</SelectItem>
              <SelectItem value="1year">近1年</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-chart-1" />
              <div>
                <div className="text-2xl font-bold text-foreground">2,847</div>
                <div className="text-sm text-muted-foreground">已处理文档</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% 本月</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-chart-2" />
              <div>
                <div className="text-2xl font-bold text-foreground">31,278</div>
                <div className="text-sm text-muted-foreground">提取实体</div>
                <div className="text-xs text-green-600 mt-1">↑ 8% 本月</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Network className="w-8 h-8 text-chart-3" />
              <div>
                <div className="text-2xl font-bold text-foreground">18,542</div>
                <div className="text-sm text-muted-foreground">关系连接</div>
                <div className="text-xs text-green-600 mt-1">↑ 15% 本月</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-chart-4" />
              <div>
                <div className="text-2xl font-bold text-foreground">96.5%</div>
                <div className="text-sm text-muted-foreground">平均准确率</div>
                <div className="text-xs text-green-600 mt-1">↑ 2% 本月</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="quality">质量分析</TabsTrigger>
          <TabsTrigger value="entities">实体分析</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="documents">文档详情</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  <span>文档类型分布</span>
                </CardTitle>
                <CardDescription>按文档格式统计处理量</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={documentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {documentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Processing Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>处理趋势</span>
                </CardTitle>
                <CardDescription>文档处理量月度趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={processingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="processed" stackId="1" stroke="#be123c" fill="#be123c" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>质量指标</span>
                </CardTitle>
                <CardDescription>系统处理质量评估</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityMetricsData.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">目标: {metric.target}%</span>
                          <Badge
                            variant={metric.status === "excellent" ? "default" : "secondary"}
                            className={
                              metric.status === "excellent"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {metric.value}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>质量趋势</span>
                </CardTitle>
                <CardDescription>处理质量月度变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="processed"
                      stroke="#be123c"
                      strokeWidth={2}
                      dot={{ fill: "#be123c" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entity Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>实体类型分布</span>
                </CardTitle>
                <CardDescription>按实体类型统计抽取结果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entityTypeDistribution.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entity.color }} />
                        <span className="font-medium">{entity.type}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">{entity.count}</span>
                        <Badge variant="secondary">{entity.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Entity Extraction Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>实体抽取统计</span>
                </CardTitle>
                <CardDescription>实体和关系抽取月度统计</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processingTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="entities" fill="#be123c" />
                    <Bar dataKey="relations" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>综合趋势分析</span>
              </CardTitle>
              <CardDescription>文档处理、实体抽取和关系构建的综合趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={processingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="processed" stroke="#be123c" strokeWidth={2} name="处理文档数" />
                  <Line type="monotone" dataKey="entities" stroke="#ec4899" strokeWidth={2} name="提取实体数" />
                  <Line type="monotone" dataKey="relations" stroke="#f59e0b" strokeWidth={2} name="关系连接数" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>最近处理文档</span>
                  </CardTitle>
                  <CardDescription>详细的文档处理记录和质量评估</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="搜索文档..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>{doc.processed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{doc.entities}</div>
                        <div className="text-xs text-muted-foreground">实体</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{doc.relations}</div>
                        <div className="text-xs text-muted-foreground">关系</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-medium ${getQualityColor(doc.quality)}`}>{doc.quality}%</div>
                        <div className="text-xs text-muted-foreground">质量</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
