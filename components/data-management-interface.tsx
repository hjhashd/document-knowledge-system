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
import {
  Database,
  HardDrive,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Archive,
  Shield,
  Clock,
  FileText,
  Table,
} from "lucide-react"

const mockDatasets = [
  {
    id: "1",
    name: "合同文档集",
    type: "documents",
    size: "2.3 GB",
    records: 1247,
    lastUpdated: "2024-03-15 14:30",
    status: "active",
    retention: "7年",
  },
  {
    id: "2",
    name: "财务报告集",
    type: "structured",
    size: "856 MB",
    records: 3421,
    lastUpdated: "2024-03-15 12:15",
    status: "active",
    retention: "10年",
  },
  {
    id: "3",
    name: "历史归档数据",
    type: "archive",
    size: "15.7 GB",
    records: 8934,
    lastUpdated: "2024-03-10 09:20",
    status: "archived",
    retention: "永久",
  },
]

const mockStorageStats = {
  total: "100 GB",
  used: "67.2 GB",
  available: "32.8 GB",
  usage: 67.2,
}

export function DataManagementInterface() {
  const [selectedDataset, setSelectedDataset] = useState(mockDatasets[0])
  const [searchQuery, setSearchQuery] = useState("")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "documents":
        return FileText
      case "structured":
        return Table
      case "archive":
        return Archive
      default:
        return Database
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "archived":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">数据管理</h1>
          <p className="text-muted-foreground">文档数据存储、备份和生命周期管理</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            导入数据
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{mockStorageStats.used}</p>
                <p className="text-xs text-muted-foreground">已使用</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mockStorageStats.available}</p>
                <p className="text-xs text-muted-foreground">可用空间</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {mockDatasets.reduce((sum, ds) => sum + ds.records, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">总记录数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Archive className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{mockDatasets.length}</p>
                <p className="text-xs text-muted-foreground">数据集</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">存储使用情况</CardTitle>
          <CardDescription>当前存储空间使用状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>存储使用率</span>
              <span>{mockStorageStats.usage.toFixed(1)}%</span>
            </div>
            <Progress value={mockStorageStats.usage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {mockStorageStats.used} / {mockStorageStats.total}
              </span>
              <span>剩余 {mockStorageStats.available}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dataset List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">数据集</CardTitle>
            <CardDescription>管理文档数据集合</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索数据集..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="documents">文档</SelectItem>
                  <SelectItem value="structured">结构化</SelectItem>
                  <SelectItem value="archive">归档</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {mockDatasets.map((dataset) => {
                  const IconComponent = getTypeIcon(dataset.type)
                  return (
                    <div
                      key={dataset.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDataset.id === dataset.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{dataset.name}</span>
                        </div>
                        <div className={`w-2 h-2 ${getStatusColor(dataset.status)} rounded-full`} />
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>大小: {dataset.size}</span>
                          <span>记录: {dataset.records.toLocaleString()}</span>
                        </div>
                        <div>更新: {dataset.lastUpdated}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Dataset Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">数据集详情</CardTitle>
            <CardDescription>数据集管理和操作</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="records">记录</TabsTrigger>
                <TabsTrigger value="backup">备份</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">基本信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>名称</span>
                          <span>{selectedDataset.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>类型</span>
                          <Badge variant="outline">{selectedDataset.type}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>状态</span>
                          <Badge variant={selectedDataset.status === "active" ? "default" : "secondary"}>
                            {selectedDataset.status === "active" ? "活跃" : "归档"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>保留期</span>
                          <span>{selectedDataset.retention}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">统计信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>记录数量</span>
                          <span>{selectedDataset.records.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>存储大小</span>
                          <span>{selectedDataset.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>最后更新</span>
                          <span>{selectedDataset.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>访问频率</span>
                          <span>每日 {Math.floor(Math.random() * 100)} 次</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    归档数据
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除数据集
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">数据记录</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      筛选
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {Array.from({ length: 20 }, (_, i) => (
                      <Card key={i}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">记录 #{i + 1}</p>
                                <p className="text-xs text-muted-foreground">
                                  创建时间: 2024-03-{String(15 - Math.floor(i / 2)).padStart(2, "0")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {Math.random() > 0.5 ? "已处理" : "待处理"}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">备份策略</h4>
                      <div className="space-y-3">
                        <div>
                          <Label>备份频率</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">每小时</SelectItem>
                              <SelectItem value="daily">每日</SelectItem>
                              <SelectItem value="weekly">每周</SelectItem>
                              <SelectItem value="monthly">每月</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>保留份数</Label>
                          <Input type="number" defaultValue="30" />
                        </div>
                        <Button className="w-full">
                          <Shield className="w-4 h-4 mr-2" />
                          更新策略
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">最近备份</h4>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                  <p className="text-xs font-medium">2024-03-{String(15 - i).padStart(2, "0")} 02:00</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(Math.random() * 1000).toFixed(0)} MB
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium">访问控制</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">启用访问日志</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">需要身份验证</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">启用数据加密</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-medium">生命周期管理</h4>
                      <div>
                        <Label>自动归档时间</Label>
                        <Select defaultValue="1year">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6months">6个月</SelectItem>
                            <SelectItem value="1year">1年</SelectItem>
                            <SelectItem value="2years">2年</SelectItem>
                            <SelectItem value="never">永不归档</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>自动删除时间</Label>
                        <Select defaultValue="7years">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3years">3年</SelectItem>
                            <SelectItem value="5years">5年</SelectItem>
                            <SelectItem value="7years">7年</SelectItem>
                            <SelectItem value="never">永不删除</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
