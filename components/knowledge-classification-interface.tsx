"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FolderTree, Tag, Brain, Search, Plus, Edit, Trash2, Filter } from "lucide-react"

export function KnowledgeClassificationInterface() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const knowledgeItems = [
    {
      id: "1",
      title: "数字化转型策略",
      content: "企业数字化转型的核心策略包括技术升级、流程优化、人才培养...",
      category: "战略规划",
      tags: ["数字化", "转型", "策略"],
      source: "企业转型报告.pdf",
      confidence: 0.92,
      created: "2024-01-15",
    },
    {
      id: "2",
      title: "AI技术应用场景",
      content: "人工智能在企业中的主要应用场景包括客户服务、数据分析、流程自动化...",
      category: "技术应用",
      tags: ["AI", "应用", "自动化"],
      source: "AI应用白皮书.pdf",
      confidence: 0.88,
      created: "2024-01-14",
    },
    {
      id: "3",
      title: "风险管理框架",
      content: "企业风险管理框架应包含风险识别、评估、控制和监控四个环节...",
      category: "风险管理",
      tags: ["风险", "管理", "框架"],
      source: "风险管理手册.docx",
      confidence: 0.95,
      created: "2024-01-13",
    },
  ]

  const categories = [
    { id: "strategy", name: "战略规划", count: 15, color: "bg-blue-100 text-blue-800" },
    { id: "technology", name: "技术应用", count: 23, color: "bg-green-100 text-green-800" },
    { id: "risk", name: "风险管理", count: 8, color: "bg-red-100 text-red-800" },
    { id: "finance", name: "财务分析", count: 12, color: "bg-yellow-100 text-yellow-800" },
    { id: "market", name: "市场研究", count: 18, color: "bg-purple-100 text-purple-800" },
  ]

  const tags = [
    { name: "数字化", count: 25 },
    { name: "AI", count: 18 },
    { name: "转型", count: 15 },
    { name: "风险", count: 12 },
    { name: "策略", count: 20 },
    { name: "自动化", count: 14 },
  ]

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            搜索和筛选
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索知识条目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 分类管理 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                分类管理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                      {category.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">{category.count}</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                新建分类
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                标签云
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.name}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {tag.name} ({tag.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 知识条目列表 */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  知识条目 ({filteredItems.length})
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    批量分类
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    手动添加
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="list">列表视图</TabsTrigger>
                  <TabsTrigger value="grid">卡片视图</TabsTrigger>
                  <TabsTrigger value="tree">树形视图</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedItems([...selectedItems, item.id])
                              } else {
                                setSelectedItems(selectedItems.filter((id) => id !== item.id))
                              }
                            }}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{item.category}</Badge>
                                <Badge variant="secondary">{Math.round(item.confidence * 100)}%</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {item.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>来源: {item.source}</span>
                                <span>•</span>
                                <span>{item.created}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="grid" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems([...selectedItems, item.id])
                                } else {
                                  setSelectedItems(selectedItems.filter((id) => id !== item.id))
                                }
                              }}
                            />
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <CardTitle className="text-base">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>置信度: {Math.round(item.confidence * 100)}%</span>
                            <span>{item.created}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tree" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>树形视图正在开发中...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
