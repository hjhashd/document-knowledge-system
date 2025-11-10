"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tags, Plus, Edit, Trash2, Sparkles, Download } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
  description: string
  documentCount: number
  isAIGenerated: boolean
  category: string
}

export function TagsManagementInterface() {
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "1",
      name: "合同",
      color: "blue",
      description: "合同相关文档",
      documentCount: 15,
      isAIGenerated: false,
      category: "文档类型",
    },
    {
      id: "2",
      name: "财务",
      color: "green",
      description: "财务报表和记录",
      documentCount: 8,
      isAIGenerated: true,
      category: "业务分类",
    },
    {
      id: "3",
      name: "重要",
      color: "red",
      description: "重要文档标记",
      documentCount: 23,
      isAIGenerated: false,
      category: "优先级",
    },
  ])
  const [newTag, setNewTag] = useState({ name: "", color: "blue", description: "", category: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  const categories = ["全部", "文档类型", "业务分类", "优先级", "状态"]
  const colors = ["blue", "green", "red", "yellow", "purple", "pink", "indigo", "gray"]

  const filteredTags = tags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || tag.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateTag = () => {
    if (newTag.name.trim()) {
      const tag: Tag = {
        id: Date.now().toString(),
        name: newTag.name,
        color: newTag.color,
        description: newTag.description,
        documentCount: 0,
        isAIGenerated: false,
        category: newTag.category || "未分类",
      }
      setTags([...tags, tag])
      setNewTag({ name: "", color: "blue", description: "", category: "" })
    }
  }

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const handleGenerateAITags = async () => {
    setIsGeneratingTags(true)
    // 模拟AI生成标签
    setTimeout(() => {
      const aiTags: Tag[] = [
        {
          id: Date.now().toString(),
          name: "技术文档",
          color: "purple",
          description: "AI识别的技术相关文档",
          documentCount: 5,
          isAIGenerated: true,
          category: "AI生成",
        },
        {
          id: (Date.now() + 1).toString(),
          name: "法律条款",
          color: "indigo",
          description: "AI识别的法律相关内容",
          documentCount: 3,
          isAIGenerated: true,
          category: "AI生成",
        },
      ]
      setTags([...tags, ...aiTags])
      setIsGeneratingTags(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">标签管理</h2>
          <p className="text-muted-foreground">管理文档标签，支持手动创建和AI自动生成</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateAITags} disabled={isGeneratingTags}>
            <Sparkles className="w-4 h-4 mr-2" />
            {isGeneratingTags ? "生成中..." : "AI生成标签"}
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            导出标签
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">标签管理</TabsTrigger>
          <TabsTrigger value="create">创建标签</TabsTrigger>
          <TabsTrigger value="ai-config">AI配置</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5" />
                标签列表
              </CardTitle>
              <CardDescription>管理现有标签，查看使用统计</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="搜索标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredTags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className={`bg-${tag.color}-100 text-${tag.color}-800`}>
                          {tag.name}
                        </Badge>
                        {tag.isAIGenerated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI生成
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {tag.description} • {tag.documentCount} 个文档
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>创建新标签</CardTitle>
              <CardDescription>手动创建自定义标签</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tagName">标签名称</Label>
                  <Input
                    id="tagName"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    placeholder="输入标签名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagCategory">分类</Label>
                  <Input
                    id="tagCategory"
                    value={newTag.category}
                    onChange={(e) => setNewTag({ ...newTag, category: e.target.value })}
                    placeholder="输入分类名称"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagDescription">描述</Label>
                <Textarea
                  id="tagDescription"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="输入标签描述"
                />
              </div>

              <div className="space-y-2">
                <Label>颜色</Label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTag({ ...newTag, color })}
                      className={`w-8 h-8 rounded-full bg-${color}-500 ${
                        newTag.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateTag} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                创建标签
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI标签生成配置</CardTitle>
              <CardDescription>配置AI自动生成标签的规则和参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>自动标签生成</Label>
                  <p className="text-sm text-muted-foreground">上传文档时自动生成相关标签</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>生成策略</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="content-based" defaultChecked />
                    <Label htmlFor="content-based">基于内容生成</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="filename-based" />
                    <Label htmlFor="filename-based">基于文件名生成</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="metadata-based" />
                    <Label htmlFor="metadata-based">基于元数据生成</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>最大标签数量</Label>
                <Input type="number" defaultValue="5" min="1" max="20" />
              </div>

              <div className="space-y-2">
                <Label>置信度阈值</Label>
                <div className="px-3">
                  <Progress value={75} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
