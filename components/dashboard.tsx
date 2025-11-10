import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Brain, Network, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

const stats = [
  {
    title: "已处理文档",
    value: "2,847",
    change: "+12%",
    icon: FileText,
    color: "text-chart-1",
  },
  {
    title: "提取实体",
    value: "15,432",
    change: "+8%",
    icon: Brain,
    color: "text-chart-2",
  },
  {
    title: "知识关系",
    value: "8,291",
    change: "+15%",
    icon: Network,
    color: "text-chart-3",
  },
  {
    title: "查询响应",
    value: "98.5%",
    change: "+2%",
    icon: TrendingUp,
    color: "text-chart-4",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "document",
    title: "合同文档解析完成",
    description: "提取了23个关键实体和15个关系",
    time: "2分钟前",
    status: "completed",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "extraction",
    title: "知识图谱更新",
    description: "新增127个节点和89个边",
    time: "5分钟前",
    status: "completed",
    icon: Network,
  },
  {
    id: 3,
    type: "query",
    title: "智能问答查询",
    description: '用户查询"合同条款相关信息"',
    time: "8分钟前",
    status: "processing",
    icon: Clock,
  },
  {
    id: 4,
    type: "alert",
    title: "数据质量检查",
    description: "发现3个潜在的数据不一致问题",
    time: "15分钟前",
    status: "warning",
    icon: AlertCircle,
  },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">智能文档知识工程系统</h1>
          <p className="text-muted-foreground mt-1">基于 LangExtract 和 Dolphin 的文档分析与知识管理平台</p>
        </div>
        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
          系统运行正常
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">{stat.change}</span> 较上周
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Status */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">文档处理状态</CardTitle>
            <CardDescription>当前系统处理能力和队列状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">文档解析队列</span>
                <span className="text-muted-foreground">12/50</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">信息抽取进度</span>
                <span className="text-muted-foreground">8/15</span>
              </div>
              <Progress value={53} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-card-foreground">知识图谱构建</span>
                <span className="text-muted-foreground">完成</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">系统健康状态</CardTitle>
            <CardDescription>核心组件运行状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-card-foreground">Dolphin 解析引擎</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                正常
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-card-foreground">LangExtract 引擎</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                正常
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-card-foreground">知识图谱数据库</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                维护中
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-card-foreground">问答系统</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                正常
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">最近活动</CardTitle>
          <CardDescription>系统处理和用户操作的实时动态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                <div
                  className={`p-1 rounded-full ${
                    activity.status === "completed"
                      ? "bg-green-100"
                      : activity.status === "processing"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                  }`}
                >
                  <activity.icon
                    className={`h-3 w-3 ${
                      activity.status === "completed"
                        ? "text-green-600"
                        : activity.status === "processing"
                          ? "text-blue-600"
                          : "text-yellow-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
