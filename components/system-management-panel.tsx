"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Server,
  Database,
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick as Memory,
  Network,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Save,
  Eye,
  Key,
  Bell,
} from "lucide-react"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  icon: React.ComponentType<{ className?: string }>
}

interface ServiceStatus {
  name: string
  status: "running" | "stopped" | "error" | "maintenance"
  uptime: string
  version: string
  description: string
}

interface UserAccount {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
  lastLogin: string
  status: "active" | "inactive" | "suspended"
}

const systemMetrics: SystemMetric[] = [
  { name: "CPU使用率", value: 45, unit: "%", status: "normal", icon: Cpu },
  { name: "内存使用", value: 68, unit: "%", status: "warning", icon: Memory },
  { name: "磁盘空间", value: 82, unit: "%", status: "critical", icon: HardDrive },
  { name: "网络流量", value: 23, unit: "MB/s", status: "normal", icon: Network },
]

const serviceStatuses: ServiceStatus[] = [
  {
    name: "Dolphin解析引擎",
    status: "running",
    uptime: "15天 8小时",
    version: "v2.1.3",
    description: "文档视觉解析和版面分析服务",
  },
  {
    name: "LangExtract引擎",
    status: "running",
    uptime: "15天 8小时",
    version: "v1.8.2",
    description: "智能信息抽取和结构化处理",
  },
  {
    name: "知识图谱数据库",
    status: "maintenance",
    uptime: "2小时 15分钟",
    version: "Neo4j 5.12",
    description: "图数据库存储和查询服务",
  },
  {
    name: "向量数据库",
    status: "running",
    uptime: "15天 8小时",
    version: "v0.24.1",
    description: "语义向量存储和相似度检索",
  },
  {
    name: "问答系统",
    status: "running",
    uptime: "15天 8小时",
    version: "v3.2.1",
    description: "RAG增强的智能问答服务",
  },
  {
    name: "API网关",
    status: "error",
    uptime: "0分钟",
    version: "v1.5.0",
    description: "统一API接入和路由管理",
  },
]

const userAccounts: UserAccount[] = [
  {
    id: "1",
    name: "管理员",
    email: "admin@company.com",
    role: "admin",
    lastLogin: "2024-06-15 14:30",
    status: "active",
  },
  {
    id: "2",
    name: "张三",
    email: "zhangsan@company.com",
    role: "user",
    lastLogin: "2024-06-15 13:45",
    status: "active",
  },
  {
    id: "3",
    name: "李四",
    email: "lisi@company.com",
    role: "user",
    lastLogin: "2024-06-14 16:20",
    status: "active",
  },
  {
    id: "4",
    name: "王五",
    email: "wangwu@company.com",
    role: "viewer",
    lastLogin: "2024-06-13 09:15",
    status: "inactive",
  },
]

export function SystemManagementPanel() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [systemSettings, setSystemSettings] = useState({
    maxConcurrentProcessing: [5],
    confidenceThreshold: [0.8],
    enableAutoBackup: true,
    backupInterval: "daily",
    logLevel: "info",
    enableNotifications: true,
    maxFileSize: [100],
    sessionTimeout: [30],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "active":
      case "normal":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
      case "critical":
      case "suspended":
        return "text-red-600"
      case "maintenance":
      case "inactive":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "maintenance":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "stopped":
      case "inactive":
        return <Pause className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleServiceAction = (serviceName: string, action: "start" | "stop" | "restart") => {
    console.log(`${action} service: ${serviceName}`)
    // Implement service control logic
  }

  const handleSaveSettings = () => {
    console.log("Saving system settings:", systemSettings)
    // Implement settings save logic
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">系统管理面板</h1>
          <p className="text-muted-foreground mt-1">系统监控、配置管理和用户权限控制</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            系统正常
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出日志
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                    <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                      {metric.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={metric.status === "normal" ? "secondary" : "destructive"}
                    className={
                      metric.status === "normal"
                        ? "bg-green-100 text-green-800"
                        : metric.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {metric.status === "normal" ? "正常" : metric.status === "warning" ? "警告" : "严重"}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.value} className="mt-3 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="services">服务状态</TabsTrigger>
          <TabsTrigger value="settings">系统配置</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="backup">备份恢复</TabsTrigger>
          <TabsTrigger value="logs">系统日志</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-primary" />
                <span>核心服务状态</span>
              </CardTitle>
              <CardDescription>监控和管理系统核心组件运行状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceStatuses.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium text-foreground">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>版本: {service.version}</span>
                          <span>运行时间: {service.uptime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={service.status === "running" ? "secondary" : "destructive"}
                        className={getStatusColor(service.status)}
                      >
                        {service.status === "running"
                          ? "运行中"
                          : service.status === "stopped"
                            ? "已停止"
                            : service.status === "error"
                              ? "错误"
                              : "维护中"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleServiceAction(service.name, "restart")}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleServiceAction(service.name, service.status === "running" ? "stop" : "start")
                        }
                      >
                        {service.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>处理配置</span>
                </CardTitle>
                <CardDescription>调整文档处理和AI模型参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>最大并发处理数</Label>
                  <Slider
                    value={systemSettings.maxConcurrentProcessing}
                    onValueChange={(value) =>
                      setSystemSettings((prev) => ({ ...prev, maxConcurrentProcessing: value }))
                    }
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    当前值: {systemSettings.maxConcurrentProcessing[0]}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>置信度阈值</Label>
                  <Slider
                    value={systemSettings.confidenceThreshold}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, confidenceThreshold: value }))}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">当前值: {systemSettings.confidenceThreshold[0]}</div>
                </div>

                <div className="space-y-2">
                  <Label>最大文件大小 (MB)</Label>
                  <Slider
                    value={systemSettings.maxFileSize}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, maxFileSize: value }))}
                    max={500}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">当前值: {systemSettings.maxFileSize[0]} MB</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-level">日志级别</Label>
                  <Select
                    value={systemSettings.logLevel}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, logLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>通知配置</span>
                </CardTitle>
                <CardDescription>系统通知和告警设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-notifications">启用系统通知</Label>
                  <Switch
                    id="enable-notifications"
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({ ...prev, enableNotifications: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>会话超时时间 (分钟)</Label>
                  <Slider
                    value={systemSettings.sessionTimeout}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, sessionTimeout: value }))}
                    max={120}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">当前值: {systemSettings.sessionTimeout[0]} 分钟</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-interval">备份间隔</Label>
                  <Select
                    value={systemSettings.backupInterval}
                    onValueChange={(value) => setSystemSettings((prev) => ({ ...prev, backupInterval: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">每小时</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">启用自动备份</Label>
                  <Switch
                    id="auto-backup"
                    checked={systemSettings.enableAutoBackup}
                    onCheckedChange={(checked) => setSystemSettings((prev) => ({ ...prev, enableAutoBackup: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>用户账户管理</span>
                  </CardTitle>
                  <CardDescription>管理系统用户账户和权限</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Users className="w-4 h-4 mr-2" />
                  添加用户
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userAccounts.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>最后登录: {user.lastLogin}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={
                          user.role === "admin"
                            ? "bg-primary text-primary-foreground"
                            : user.role === "user"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {user.role === "admin" ? "管理员" : user.role === "user" ? "用户" : "查看者"}
                      </Badge>
                      <Badge
                        variant={user.status === "active" ? "secondary" : "destructive"}
                        className={getStatusColor(user.status)}
                      >
                        {user.status === "active" ? "活跃" : user.status === "inactive" ? "非活跃" : "已暂停"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        编辑
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>安全配置</span>
                </CardTitle>
                <CardDescription>系统安全和访问控制设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">管理员密码</Label>
                  <div className="flex space-x-2">
                    <Input type="password" placeholder="输入新密码" />
                    <Button variant="outline" size="sm">
                      更新
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API端点</Label>
                  <Input value="https://api.company.com/v1" readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-domains">允许的域名</Label>
                  <Textarea placeholder="输入允许访问的域名，每行一个" className="min-h-[100px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-primary" />
                  <span>API密钥管理</span>
                </CardTitle>
                <CardDescription>管理系统API访问密钥</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>显示API密钥</Label>
                  <Switch checked={showApiKeys} onCheckedChange={setShowApiKeys} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">主API密钥</div>
                      <div className="text-sm text-muted-foreground">
                        {showApiKeys ? "sk-1234567890abcdef..." : "••••••••••••••••"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">只读API密钥</div>
                      <div className="text-sm text-muted-foreground">
                        {showApiKeys ? "sk-abcdef1234567890..." : "••••••••••••••••"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Key className="w-4 h-4 mr-2" />
                  生成新密钥
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>数据备份</span>
                </CardTitle>
                <CardDescription>系统数据备份和恢复管理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">最新备份</div>
                      <div className="text-sm text-muted-foreground">2024-06-15 02:00:00</div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      成功
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">备份大小</div>
                      <div className="text-sm text-muted-foreground">2.4 GB</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">下次备份</div>
                      <div className="text-sm text-muted-foreground">2024-06-16 02:00:00</div>
                    </div>
                    <Badge variant="outline">计划中</Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Database className="w-4 h-4 mr-2" />
                    立即备份
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    恢复数据
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>备份历史</span>
                </CardTitle>
                <CardDescription>查看历史备份记录</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {[
                      { date: "2024-06-15", size: "2.4 GB", status: "success" },
                      { date: "2024-06-14", size: "2.3 GB", status: "success" },
                      { date: "2024-06-13", size: "2.2 GB", status: "success" },
                      { date: "2024-06-12", size: "2.1 GB", status: "failed" },
                      { date: "2024-06-11", size: "2.0 GB", status: "success" },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <div className="font-medium">{backup.date}</div>
                          <div className="text-muted-foreground">{backup.size}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={backup.status === "success" ? "secondary" : "destructive"}
                            className={backup.status === "success" ? "bg-green-100 text-green-800" : ""}
                          >
                            {backup.status === "success" ? "成功" : "失败"}
                          </Badge>
                          {backup.status === "success" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span>系统日志</span>
                  </CardTitle>
                  <CardDescription>查看系统运行日志和错误记录</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部日志</SelectItem>
                      <SelectItem value="error">错误日志</SelectItem>
                      <SelectItem value="warning">警告日志</SelectItem>
                      <SelectItem value="info">信息日志</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2 font-mono text-sm">
                  {[
                    {
                      time: "2024-06-15 14:30:25",
                      level: "INFO",
                      message: "Document processing completed successfully",
                    },
                    {
                      time: "2024-06-15 14:29:18",
                      level: "INFO",
                      message: "New user session started: user@company.com",
                    },
                    { time: "2024-06-15 14:28:45", level: "WARNING", message: "High memory usage detected: 85%" },
                    {
                      time: "2024-06-15 14:27:32",
                      level: "INFO",
                      message: "Knowledge graph updated with 23 new entities",
                    },
                    {
                      time: "2024-06-15 14:26:15",
                      level: "ERROR",
                      message: "API Gateway connection failed - retrying...",
                    },
                    { time: "2024-06-15 14:25:08", level: "INFO", message: "Backup process initiated" },
                    { time: "2024-06-15 14:24:22", level: "INFO", message: "Document upload: contract_agreement.pdf" },
                    {
                      time: "2024-06-15 14:23:45",
                      level: "WARNING",
                      message: "Slow query detected in knowledge graph",
                    },
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-2 hover:bg-muted/50 rounded">
                      <span className="text-muted-foreground whitespace-nowrap">{log.time}</span>
                      <Badge
                        variant={
                          log.level === "ERROR" ? "destructive" : log.level === "WARNING" ? "secondary" : "outline"
                        }
                        className={`text-xs ${
                          log.level === "ERROR"
                            ? "bg-red-100 text-red-800"
                            : log.level === "WARNING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.level}
                      </Badge>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
