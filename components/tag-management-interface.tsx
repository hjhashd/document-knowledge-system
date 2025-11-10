"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tag, Plus, Edit, Trash2, Search, Brain, Hash } from "lucide-react"

export function TagManagementInterface() {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const existingTags = [
    { id: "1", name: "数字化", color: "#3b82f6", count: 25, category: "技术", auto: false },
    { id: "2", name: "AI", color: "#10b981", count: 18, category: "技术", auto: true },
    { id: "3", name: "转型", color: "#f59e0b", count: 15, category: "战略", auto: false },
    { id: "4", name: "风险", color: "#ef4444", count: 12, category: "管理", auto: true },
    { id: "5", name: "策略", color: "#8b5cf6", count: 20, category: "战略", auto: false },
    { id: "6", name: "自动化", color: "#06b6d4", count: 14, category: "技术", auto: true },
    { id: "7", name: "合规", color: "#84cc16", count: 8, category: "法务", auto: true },
    { id: "8", name: "创新", color: "#f97316", count: 22, category: "战略", auto: false },
  ]

  const tagCategories = [
    { name: "技术", count: 57, color: "#3b82f6" },
    { name: "战略", count: 57, color: "#8b5cf6" },
    { name: "管理", count: 32, color: "#ef4444" },
    { name: "法务", count: 18, color: "#84cc16" },
    { name: "财务", count: 25, color: "#f59e0b" },
  ]

  const colorOptions = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ]

  const filteredTags = existingTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    // 这里会调用API创建新标签
    console.log("Creating tag:", { name: newTagName, color: newTagColor })
    setNewTagName("")
  }

  const handleDeleteTag = (tagId: string) => {
    // 这里会调用API删除标签
    console.log("Deleting tag:", tagId)
  }

  const handleBulkOperation = (operation: string) => {
    console.log(`Bulk ${operation} for tags:`, selectedTags)
  }

  return (
    <div className="space-y-6">
      {/* 标签统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tagCategories.map((category) => (
          <Card key={category.name}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count} 个标签</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 标签创建 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                创建标签
              </CardTitle>
              <CardDescription>手动创建新的标签</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>标签名称</Label>
                <Input
                  placeholder="输入标签名称..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>标签颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newTagColor === color ? "border-gray-400" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>标签分类</Label>
                <Select defaultValue="技术">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tagCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>标签描述</Label>
                <Textarea placeholder="描述标签的用途和含义..." className="min-h-[80px]" />
              </div>

              <Button onClick={handleCreateTag} disabled={!newTagName.trim()} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                创建标签
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI标签生成
              </CardTitle>
              <CardDescription>基于文档内容自动生成标签</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>生成策略</Label>
                <Select defaultValue="smart">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart">智能推荐</SelectItem>
                    <SelectItem value="keyword">关键词提取</SelectItem>
                    <SelectItem value="semantic">语义分析</SelectItem>
                    <SelectItem value="category">分类标签</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>最大数量</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3个</SelectItem>
                    <SelectItem value="5">5个</SelectItem>
                    <SelectItem value="10">10个</SelectItem>
                    <SelectItem value="unlimited">不限制</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Brain className="h-4 w-4 mr-2" />
                生成AI标签
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 标签管理 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  标签管理 ({filteredTags.length})
                </span>
                <div className="flex gap-2">
                  {selectedTags.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleBulkOperation("edit")}>
                        批量编辑
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkOperation("delete")}>
                        批量删除
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="all">全部标签</TabsTrigger>
                    <TabsTrigger value="manual">手动创建</TabsTrigger>
                    <TabsTrigger value="auto">AI生成</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索标签..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTags.map((tag) => (
                      <Card key={tag.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedTags.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTags([...selectedTags, tag.id])
                                } else {
                                  setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                                }
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  style={{ backgroundColor: tag.color, color: "white" }}
                                  className="flex items-center gap-1"
                                >
                                  <Hash className="h-3 w-3" />
                                  {tag.name}
                                </Badge>
                                {tag.auto && (
                                  <Badge variant="secondary" className="text-xs">
                                    AI生成
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>分类: {tag.category}</span>
                                <span>使用: {tag.count} 次</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTags
                      .filter((tag) => !tag.auto)
                      .map((tag) => (
                        <Card key={tag.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedTags.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTags([...selectedTags, tag.id])
                                  } else {
                                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    style={{ backgroundColor: tag.color, color: "white" }}
                                    className="flex items-center gap-1"
                                  >
                                    <Hash className="h-3 w-3" />
                                    {tag.name}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>分类: {tag.category}</span>
                                  <span>使用: {tag.count} 次</span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="auto" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTags
                      .filter((tag) => tag.auto)
                      .map((tag) => (
                        <Card key={tag.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedTags.includes(tag.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTags([...selectedTags, tag.id])
                                  } else {
                                    setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    style={{ backgroundColor: tag.color, color: "white" }}
                                    className="flex items-center gap-1"
                                  >
                                    <Hash className="h-3 w-3" />
                                    {tag.name}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    AI生成
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>分类: {tag.category}</span>
                                  <span>使用: {tag.count} 次</span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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
