"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, Edit, Save, X, Link, Calendar, FileType, HardDrive, Search } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  tags: string[]
  description: string
  relatedDocuments: string[]
  status: string
}

export function DocumentEditInterface() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "合同协议_2024.pdf",
      type: "PDF",
      size: "2.5 MB",
      uploadDate: "2024-01-15",
      tags: ["合同", "重要", "2024"],
      description: "年度合作协议文档",
      relatedDocuments: ["附件A", "附件B"],
      status: "已审核",
    },
    {
      id: "2",
      name: "财务报表.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      tags: ["财务", "报表"],
      description: "月度财务报表",
      relatedDocuments: [],
      status: "待审核",
    },
  ])

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTag, setNewTag] = useState("")

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleEditDocument = (doc: Document) => {
    setEditingDoc({ ...doc })
    setSelectedDoc(doc)
  }

  const handleSaveDocument = () => {
    if (editingDoc) {
      setDocuments(documents.map((doc) => (doc.id === editingDoc.id ? editingDoc : doc)))
      setEditingDoc(null)
      setSelectedDoc(editingDoc)
    }
  }

  const handleCancelEdit = () => {
    setEditingDoc(null)
  }

  const handleAddTag = () => {
    if (newTag.trim() && editingDoc) {
      setEditingDoc({
        ...editingDoc,
        tags: [...editingDoc.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (editingDoc) {
      setEditingDoc({
        ...editingDoc,
        tags: editingDoc.tags.filter((tag) => tag !== tagToRemove),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">文档编辑</h2>
          <p className="text-muted-foreground">修改文档名称、标签和关联信息</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 文档列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              文档列表
            </CardTitle>
            <CardDescription>选择要编辑的文档</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="搜索文档..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoc?.id === doc.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <FileType className="w-3 h-3" />
                          <span>{doc.type}</span>
                          <HardDrive className="w-3 h-3" />
                          <span>{doc.size}</span>
                          <Calendar className="w-3 h-3" />
                          <span>{doc.uploadDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditDocument(doc)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 文档详情/编辑 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {editingDoc ? "编辑文档" : "文档详情"}
              </span>
              {selectedDoc && !editingDoc && (
                <Button onClick={() => handleEditDocument(selectedDoc)}>
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDoc ? (
              <div className="text-center text-muted-foreground py-8">请选择要查看或编辑的文档</div>
            ) : editingDoc ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docName">文档名称</Label>
                  <Input
                    id="docName"
                    value={editingDoc.name}
                    onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docDescription">描述</Label>
                  <Textarea
                    id="docDescription"
                    value={editingDoc.description}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                    placeholder="输入文档描述"
                  />
                </div>

                <div className="space-y-2">
                  <Label>标签</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingDoc.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加标签"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button onClick={handleAddTag}>添加</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>文档信息（只读）</Label>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">类型：</span>
                      <span>{editingDoc.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">大小：</span>
                      <span>{editingDoc.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">上传日期：</span>
                      <span>{editingDoc.uploadDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">状态：</span>
                      <span>{editingDoc.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveDocument}>
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedDoc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDoc.description}</p>
                </div>

                <div className="space-y-2">
                  <Label>标签</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">类型：</span>
                    <span>{selectedDoc.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">大小：</span>
                    <span>{selectedDoc.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">上传日期：</span>
                    <span>{selectedDoc.uploadDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">状态：</span>
                    <span>{selectedDoc.status}</span>
                  </div>
                </div>

                {selectedDoc.relatedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <Label>关联文档</Label>
                    <div className="space-y-1">
                      {selectedDoc.relatedDocuments.map((doc) => (
                        <div key={doc} className="flex items-center gap-2 text-sm">
                          <Link className="w-3 h-3" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
