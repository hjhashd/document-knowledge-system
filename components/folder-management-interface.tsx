"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderOpen, FolderPlus, FileText, MoreHorizontal, Edit, Trash2, Move, Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Folder {
  id: string
  name: string
  parentId?: string
  documentCount: number
  subfolderCount: number
  createdAt: string
  updatedAt: string
  color?: string
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  folderId: string
  createdAt: string
  status: string
}

export function FolderManagementInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderParent, setNewFolderParent] = useState("")

  // Mock data
  const folders: Folder[] = [
    {
      id: "1",
      name: "合同文档",
      documentCount: 45,
      subfolderCount: 3,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      color: "blue",
    },
    {
      id: "2",
      name: "财务报表",
      documentCount: 28,
      subfolderCount: 2,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      color: "green",
    },
    {
      id: "3",
      name: "法律文件",
      parentId: "1",
      documentCount: 12,
      subfolderCount: 0,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-19",
      color: "red",
    },
    {
      id: "4",
      name: "采购合同",
      parentId: "1",
      documentCount: 18,
      subfolderCount: 1,
      createdAt: "2024-01-17",
      updatedAt: "2024-01-21",
      color: "purple",
    },
    {
      id: "5",
      name: "销售合同",
      parentId: "1",
      documentCount: 15,
      subfolderCount: 0,
      createdAt: "2024-01-18",
      updatedAt: "2024-01-22",
      color: "orange",
    },
  ]

  const documents: Document[] = [
    {
      id: "1",
      name: "供应商合作协议.pdf",
      type: "PDF",
      size: "2.3 MB",
      folderId: "4",
      createdAt: "2024-01-20",
      status: "已处理",
    },
    {
      id: "2",
      name: "销售合同模板.docx",
      type: "DOCX",
      size: "1.8 MB",
      folderId: "5",
      createdAt: "2024-01-21",
      status: "处理中",
    },
  ]

  const handleCreateFolder = () => {
    // 创建文件夹逻辑
    console.log("Creating folder:", newFolderName, "Parent:", newFolderParent)
    setIsCreateDialogOpen(false)
    setNewFolderName("")
    setNewFolderParent("")
  }

  const getColorClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "green":
        return "bg-green-100 text-green-800 border-green-200"
      case "red":
        return "bg-red-100 text-red-800 border-red-200"
      case "purple":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const rootFolders = filteredFolders.filter((folder) => !folder.parentId)
  const getSubfolders = (parentId: string) => filteredFolders.filter((folder) => folder.parentId === parentId)

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索文件夹..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              新建文件夹
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新文件夹</DialogTitle>
              <DialogDescription>为您的文档创建一个新的分类文件夹</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  文件夹名称
                </Label>
                <Input
                  id="name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="col-span-3"
                  placeholder="输入文件夹名称"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent" className="text-right">
                  父文件夹
                </Label>
                <Select value={newFolderParent} onValueChange={setNewFolderParent}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择父文件夹（可选）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">根目录</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateFolder}>创建文件夹</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 文件夹树形结构 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>文件夹结构</CardTitle>
            <CardDescription>层级管理您的文档分类</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {rootFolders.map((folder) => (
                  <div key={folder.id} className="space-y-1">
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent ${
                        selectedFolder === folder.id ? "bg-accent" : ""
                      } ${getColorClass(folder.color)}`}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-4 w-4" />
                        <span className="font-medium">{folder.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {folder.documentCount}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Move className="mr-2 h-4 w-4" />
                            移动
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* 子文件夹 */}
                    {getSubfolders(folder.id).map((subfolder) => (
                      <div
                        key={subfolder.id}
                        className={`flex items-center justify-between p-2 ml-6 rounded-lg border cursor-pointer hover:bg-accent ${
                          selectedFolder === subfolder.id ? "bg-accent" : ""
                        } ${getColorClass(subfolder.color)}`}
                        onClick={() => setSelectedFolder(subfolder.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="h-3 w-3" />
                          <span className="text-sm">{subfolder.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {subfolder.documentCount}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              重命名
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Move className="mr-2 h-4 w-4" />
                              移动
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>文件夹详情</CardTitle>
            <CardDescription>
              {selectedFolder
                ? `查看 "${folders.find((f) => f.id === selectedFolder)?.name}" 的详细信息`
                : "选择一个文件夹查看详情"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedFolder ? (
              <div className="space-y-4">
                {(() => {
                  const folder = folders.find((f) => f.id === selectedFolder)
                  if (!folder) return null

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">文档数量</Label>
                          <div className="text-2xl font-bold">{folder.documentCount}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">子文件夹</Label>
                          <div className="text-2xl font-bold">{folder.subfolderCount}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">创建时间</Label>
                        <div className="text-sm text-muted-foreground">{folder.createdAt}</div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">最后更新</Label>
                        <div className="text-sm text-muted-foreground">{folder.updatedAt}</div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">文档列表</Label>
                        <ScrollArea className="h-40">
                          <div className="space-y-2">
                            {documents
                              .filter((doc) => doc.folderId === selectedFolder)
                              .map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4" />
                                    <div>
                                      <div className="text-sm font-medium">{doc.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {doc.type} • {doc.size}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {doc.status}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>选择一个文件夹查看详情</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
